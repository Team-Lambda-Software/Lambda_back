import { Category } from "src/categories/domain/categories"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Trainer } from "src/trainer/domain/trainer"



export interface CreateCourseServiceEntryDto extends ApplicationServiceEntryDto
{
    trainer: Trainer
    name: string
    description: string
    weeksDuration: number
    minutesDuration: number
    level: number
    category: Category
    tags: string[]
    image: File
}