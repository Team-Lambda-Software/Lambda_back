import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"



export interface CreateBlogServiceEntryDto extends ApplicationServiceEntryDto
{
    trainerId: string
    title: string
    body: string
    images: string[]
    categoryId: string
    tags: string[]
}
