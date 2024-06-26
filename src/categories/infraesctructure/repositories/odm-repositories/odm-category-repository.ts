import { Category } from "src/categories/domain/categories"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Model } from "mongoose"
import { OdmCategoryEntity } from "../../entities/odm-entities/odm-category.entity"
import { CategoryQueryRepository } from "../category-query-repository.interface"



export class OdmCategoryRepository implements CategoryQueryRepository{

    private readonly categoryModel: Model<OdmCategoryEntity>
    constructor ( categoryModel: Model<OdmCategoryEntity> )
    {
        this.categoryModel = categoryModel

    }

    async saveCategory ( category: OdmCategoryEntity ): Promise<void>
    {

        await this.categoryModel.create( category )    
            

    }

    async findCategoryById ( id: string ): Promise<Result<OdmCategoryEntity>>
    {
        try{
            const category = await this.categoryModel.findOne({id})
            return Result.success<OdmCategoryEntity>( category, 200 )
        }catch (error){
            return Result.fail<OdmCategoryEntity>( error, 500, "Internal Server Error" )
        }
    }
    async findAllCategories ( pagination: PaginationDto ): Promise<Result<OdmCategoryEntity[]>>
    {
        try{
            const {page, perPage} = pagination
            // console.log(page, perPage)
            const categories = await this.categoryModel.find().skip(page).limit(perPage)
            return Result.success<OdmCategoryEntity[]>( categories, 200 )
        }catch (error){
            return Result.fail<OdmCategoryEntity[]>( error, 500, "Internal Server Error" )
        }
    }

}