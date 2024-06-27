import { Result } from "src/common/Domain/result-handler/Result"



export interface FileTransformer<F,T> {

    transformFile( file: F): Promise<Result<T>>

}