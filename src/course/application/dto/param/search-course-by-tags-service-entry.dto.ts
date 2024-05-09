import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { PaginationDto } from '../../../../common/Infraestructure/dto/entry/pagination.dto';



export interface SearchCourseByTagsServiceEntryDto extends ApplicationServiceEntryDto{
    tags: string[]
    pagination: PaginationDto
}