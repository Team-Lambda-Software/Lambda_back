import { Result } from "src/common/Domain/result-handler/Result"
import { Category } from "../categories"

export interface ICategoryRepository {
    findCategoryById ( id: string ): Promise<Result<Category>>
}