import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"



export interface CreateCourseServiceEntryDto extends ApplicationServiceEntryDto
{
    trainerId: string
    name: string
    description: string
    weeksDuration: number
    minutesDuration: number
    level: number
    categoryId: string
    tags: string[]
    image: File
}