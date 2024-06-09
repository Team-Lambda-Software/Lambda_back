



export interface IFileUploader
{
    UploadFile ( file: File, fileName: string): Promise<string>
}