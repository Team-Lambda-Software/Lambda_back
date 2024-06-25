import { Category } from "src/categories/domain/categories"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { CategoryQueryRepository } from "src/categories/infraesctructure/repositories/category-query-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"




export class CategoryQueryRepositoryMock implements CategoryQueryRepository{
    
    private readonly categories: OdmCategoryEntity[] = []
    
    async saveCategory ( category: OdmCategoryEntity ): Promise<void>
    {
        this.categories.push( category )
    }
    async findCategoryById ( id: string ): Promise<Result<OdmCategoryEntity>>
    {
        const category = this.categories.find( category => category.id === id )
        if ( !category )
        {
            return Result.fail<OdmCategoryEntity>( new Error("Category not found"), 404, "Category not found" )
        }
        return Result.success<OdmCategoryEntity>( category, 200 )
    }
    findAllCategories ( pagination: PaginationDto ): Promise<Result<OdmCategoryEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
}