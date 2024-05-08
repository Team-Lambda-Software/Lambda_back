import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"



export interface SearchContentByCategoryServiceEntryDto extends ApplicationServiceEntryDto{

    categoryId: string
    pagination: PaginationDto

}