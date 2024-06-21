import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Course } from "src/course/domain/course"



export interface AddSectionToCourseServiceEntryDto extends ApplicationServiceEntryDto
{
    name: string
    description: string
    duration: number
    file: File
    course: Course
}
