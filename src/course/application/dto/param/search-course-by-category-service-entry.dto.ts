import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"




export interface SearchCourseByCategoryServiceEntryDto extends ApplicationServiceEntryDto{
    categoryId: string
}