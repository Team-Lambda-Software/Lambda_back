import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"




export interface AddCommentToSectionServiceEntryDto extends ApplicationServiceEntryDto{

    sectionId: string
    userId: string
    comment: string

}