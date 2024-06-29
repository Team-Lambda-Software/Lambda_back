import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section/section"




export interface AddCommentToSectionServiceEntryDto extends ApplicationServiceEntryDto{

    sectionId: string
    userId: string
    comment: string
}