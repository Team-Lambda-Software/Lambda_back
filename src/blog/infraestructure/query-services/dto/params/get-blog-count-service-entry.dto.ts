import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"



export interface GetBlogCountServiceEntryDto extends ApplicationServiceEntryDto{
    trainer?: string
    category?: string
}