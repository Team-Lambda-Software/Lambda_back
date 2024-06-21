import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob"
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"



export class AzureFileUploader implements IFileUploader {

    private async getBlobServiceInstance() { 
        const connectionString = process.env.FILE_UPLOADER_CONNECTION_STRING; 
        const blobClientService = await BlobServiceClient.fromConnectionString( connectionString, ); 
        return blobClientService; 
    } 

	private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
        const blobService = await this.getBlobServiceInstance(); 
		const containerName = process.env.CONTAINER_NAME; 
        // console.log(containerName)
		const containerClient = blobService.getContainerClient(containerName); 
		const blockBlobClient = containerClient.getBlockBlobClient(imageName); 

		return blockBlobClient; 
	} 
    
    async UploadFile(file: File, fileName: string): Promise<string> { 
        const extension = file.name.split('.').pop(); 
        const file_name = fileName + '.' + extension; 
        const blockBlobClient = await this.getBlobClient(file_name);
        // console.log('Uploading file to Azure Blob Storage 2');
        const fileUrl = blockBlobClient.url; 
        await blockBlobClient.uploadData(await file.arrayBuffer()); 
        
        return fileUrl; 
    } 

}