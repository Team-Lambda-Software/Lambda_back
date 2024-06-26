import {
    BlockBlobClient,
    BlobServiceClient,
    BlobDownloadResponseParsed,
  } from '@azure/storage-blob';
import { ImageGetter } from 'src/common/Application/image-getter/image-getter.inteface'
import { Result } from 'src/common/Domain/result-handler/Result'
  
  export class AzureBufferImageHelper implements ImageGetter{
    private async getBlobClient(
      fileName: string,
      container: string,
    ): Promise<Result<BlockBlobClient>> {
      let error: any;
      let blobClient: BlockBlobClient;
      try {
        const blobClientService = BlobServiceClient.fromConnectionString(
          process.env.FILE_UPLOADER_CONNECTION_STRING,
        );
        const containerClient = blobClientService.getContainerClient(container);
        blobClient = containerClient.getBlockBlobClient(fileName);
      } catch (err) {
        error = err;
      } finally {
        if (error) {
          return Result.fail(
            error,
            500,
            error.message || 'Ha ocurrido un error buscando la imagen')
          
        }
        if (!blobClient) {
          return Result.fail(
            new Error('No existe ese file'),
            404,
            'No existe ese file' 
          );
        }
        return Result.success(blobClient, 200);
      }
    }
  
    private async streamToBuffer(readableStream: any): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        readableStream.on('data', (data) => chunks.push(data));
        readableStream.on('end', () => resolve(Buffer.concat(chunks)));
        readableStream.on('error', reject);
      });
    }
  
    async getFile(fileName: string): Promise<Result<Buffer>> {
      //Busqueda de la imagen
      const blobClientResult: Result<BlockBlobClient> = await this.getBlobClient(
        fileName,
        process.env.CONTAINER_NAME,
      );
  
      if (!blobClientResult.isSuccess()) {
        return Result.fail(
          blobClientResult.Error,
          blobClientResult.StatusCode,
          blobClientResult.Error.message,
        );
      }
  
      //Descarga de la imagen
      let blobDownloaded: BlobDownloadResponseParsed;
      let errorDownloading: any;
      try {
        console.log('blobClientResult', blobClientResult.Value);
        blobDownloaded = await blobClientResult.Value.download();
      } catch (err) {
        errorDownloading = err;
      } finally {
        if (errorDownloading || !blobDownloaded) {
          return Result.fail(
            errorDownloading || new Error('Ha ocurrido un error descargando la imagen'),
            500,
            errorDownloading.message || 'Ha ocurrido un error descargando la imagen',
            );
        }
      }
      //Conversion de la imagen a Buffer
      let buffer: Buffer;
      let errorBuffering: any;
      try {
        buffer = await this.streamToBuffer(blobDownloaded.readableStreamBody);
      } catch (err) {
        errorBuffering = err;
      } finally {
        if (errorBuffering){
          return Result.fail(
            new Error('Ha ocurrido un error convertiendo la imagen'),
            500,
            'Ha ocurrido un error convertiendo la imagen',
          );
        }
  
        return Result.success(buffer, 200);
      }
    }
  }