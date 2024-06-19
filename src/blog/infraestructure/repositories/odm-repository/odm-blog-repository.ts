import { Category } from "src/categories/domain/categories"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Model } from "mongoose"
import { OdmCategoryEntity } from "../../entities/odm-entities/odm-category.entity"
import { OdmCategoryMapper } from "../../mappers/odm-mappers/odm-category-mapper"



export class OdmCategoryRepository implements ICategoryRepository{

    private readonly ormCategoryMapper: OdmCategoryMapper
    private readonly categoryModel: Model<OdmCategoryEntity>
    constructor ( odmCategoryMapper: OdmCategoryMapper, categoryModel: Model<OdmCategoryEntity> )
    {
        this.ormCategoryMapper = odmCategoryMapper
        this.categoryModel = categoryModel

    }

    async saveCategory ( category: Category ): Promise<Result<Category>>
    {
        try {
            const categoryPersistence = await this.ormCategoryMapper.fromDomainToPersistence( category )
            await this.categoryModel.create( categoryPersistence )    
            return Result.success<Category>( await this.ormCategoryMapper.fromPersistenceToDomain( categoryPersistence ), 201 )
        } catch ( error ) {
            return Result.fail<Category>( error, error.code, error.message )
        }
    }

    findCategoryById ( id: string ): Promise<Result<Category>>
    {
        throw new Error( "Method not implemented." )
    }
    findAllCategories ( pagination: PaginationDto ): Promise<Result<Category[]>>
    {
        throw new Error( "Method not implemented." )
    }

}