import { FileTransformer } from "src/common/Application/file-transformer/file-transformer.interface"
import { Result } from "src/common/Domain/result-handler/Result"



export class BufferBase64ImageTransformer implements FileTransformer<Buffer, string> {
    async transformFile ( file: Buffer ): Promise<Result<string>>
    {
        try
        {
            const base64 = file.toString( 'base64' )
            return Result.success( base64, 200 )
        }
        catch ( error )
        {
            return Result.fail( error, 500, error.message )
        }
    }
    
}