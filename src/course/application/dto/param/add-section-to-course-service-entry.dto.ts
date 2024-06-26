import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"



export interface AddSectionToCourseServiceEntryDto extends ApplicationServiceEntryDto
{
    name: string
    description: string
    duration: number
    file: File
    courseId: string
}
