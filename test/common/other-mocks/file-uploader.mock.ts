import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"


export class FileUploaderMock implements IFileUploader {
    
    async UploadFile(file: File, fileName: string): Promise<string> { 
        
        return fileName + '_mocked_url.com'; 
    } 

}