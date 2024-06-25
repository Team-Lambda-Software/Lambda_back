import { Category } from "src/categories/domain/categories"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmCategoryEntity } from "../entities/odm-entities/odm-category.entity"


export interface CategoryQueryRepository {
    saveCategory ( category: OdmCategoryEntity ): Promise<void>


    findCategoryById ( id: string ): Promise<Result<OdmCategoryEntity>>
  
    findAllCategories ( pagination: PaginationDto ): Promise<Result<OdmCategoryEntity[]>>
    
}