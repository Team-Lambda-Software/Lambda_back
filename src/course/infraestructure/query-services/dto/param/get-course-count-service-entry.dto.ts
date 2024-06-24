import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"



export interface GetCourseCountServiceEntryDto extends ApplicationServiceEntryDto{
    trainer?: string
    category?: string
}