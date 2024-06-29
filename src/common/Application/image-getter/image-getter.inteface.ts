import { Result } from "src/common/Domain/result-handler/Result"




export interface ImageGetter {
    getFile(fileName: string): Promise<Result<Buffer>>;
}