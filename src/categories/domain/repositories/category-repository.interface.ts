import { Result } from 'src/common/Domain/result-handler/Result'
import { Category } from '../categories'
import { PaginationDto } from '../../../common/Infraestructure/dto/entry/pagination.dto';

export interface ICategoryRepository {
    findCategoryById( id: string): Promise<Result<Category>>;
    findAllCategories( pagination: PaginationDto): Promise<Result<Category[]>>;
}