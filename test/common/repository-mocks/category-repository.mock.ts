import { Category } from "src/categories/domain/categories"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"



export class CategoryMockRepository implements ICategoryRepository{
    
    private readonly categories: Category[] = []

    async createCategory ( category: Category ): Promise<void>
    {
        this.categories.push( category )
    }
    
    async findCategoryById ( id: string ): Promise<Result<Category>>
    {
        const category = this.categories.find( category => category.Id.Value === id )
        if( category === undefined )
        {
            return Result.fail<Category>(new Error(`Category with id ${id} not found`) ,404,`Category with id ${id} not found`)
        }
        return Result.success<Category>( category , 200 )
    }

    async findAllCategories (pagination: PaginationDto): Promise<Result<Category[]>>{
        const categories = this.categories.slice( pagination.page, pagination.page + pagination.perPage )
        return Result.success<Category[]>( categories, 200 )
    }

}