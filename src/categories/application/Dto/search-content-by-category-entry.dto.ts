import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Course } from "src/course/domain/course"



export interface SearchContentByCategoryEntryDto extends ApplicationServiceEntryDto
{
    categoryId: string
    pagination: PaginationDto
}