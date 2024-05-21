import { Result } from "src/common/Domain/result-handler/Result"



export interface IDomainService <D,R>{
    execute ( domain: D ): Promise<Result<R>>
}