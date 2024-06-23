import { Result } from "src/common/Domain/result-handler/Result"



export interface Querysynchronizer<T> {
    execute(event: T): Promise<Result<string>>
}