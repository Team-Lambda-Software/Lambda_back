import { Result } from "../result-handler/Result"



export interface IDomainService <D,R>{
    execute ( domain: D ): Promise<Result<R>>
}