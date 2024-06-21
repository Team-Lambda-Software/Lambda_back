import { Category } from "src/categories/domain/categories"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Model } from "mongoose"
import { OdmCategoryEntity } from "../../entities/odm-entities/odm-category.entity"



export class OdmCategoryRepository{

    private readonly categoryModel: Model<OdmCategoryEntity>
    constructor ( categoryModel: Model<OdmCategoryEntity> )
    {
        this.categoryModel = categoryModel

    }

    async saveCategory ( category: Category ): Promise<void>
    {

        const odmCategory = new this.categoryModel({
            id: category.Id.Value,
            categoryName: category.Name.Value,
            icon: category.Icon.Value
        })
        await this.categoryModel.create( odmCategory )    
            

    }

    findCategoryById ( id: string ): Promise<Result<Category>>
    {
        throw new Error( "Method not implemented." )
    }
    async findAllCategories ( pagination: PaginationDto ): Promise<Result<OdmCategoryEntity[]>>
    {
        try{
            const {page, perPage} = pagination
            console.log(page, perPage)
            const categories = await this.categoryModel.find().skip(page).limit(perPage)
            return Result.success<OdmCategoryEntity[]>( categories, 200 )
        }catch (error){
            return Result.fail<OdmCategoryEntity[]>( error, 500, "Internal Server Error" )
        }
    }

}