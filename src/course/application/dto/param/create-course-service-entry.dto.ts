import { Category } from "src/categories/domain/categories"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Trainer } from "src/trainer/domain/trainer"



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