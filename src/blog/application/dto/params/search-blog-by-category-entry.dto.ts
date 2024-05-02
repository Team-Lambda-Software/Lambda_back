import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"




export interface SearchBlogByCategoryEntryDto extends ApplicationServiceEntryDto
{
    categoryId: string
}