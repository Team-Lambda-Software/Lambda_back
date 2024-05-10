import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"



export interface GetCategoryServiceEntryDto extends ApplicationServiceEntryDto
{
    categoryId: string
}