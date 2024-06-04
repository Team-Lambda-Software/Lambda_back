



export interface IFileUploader
{
    UploadFile ( file: Express.Multer.File, fileName: string): Promise<string>
}