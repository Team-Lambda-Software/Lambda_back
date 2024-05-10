import { Result } from 'src/common/Application/result-handler/Result'
import { Category } from '../categories'

export interface ICategoryRepository {
    findCategoryById( id: string): Promise<Result<Category>>;
    findAllCategories(): Promise<Result<Category[]>>;
}