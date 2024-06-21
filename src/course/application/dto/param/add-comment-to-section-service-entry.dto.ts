import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section/section"




export interface AddCommentToSectionServiceEntryDto extends ApplicationServiceEntryDto{

    section: Section
    userId: string
    comment: string
    course: Course
}