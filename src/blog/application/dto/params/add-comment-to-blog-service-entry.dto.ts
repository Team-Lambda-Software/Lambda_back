import { Blog } from "src/blog/domain/blog"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"




export interface AddCommentToBlogServiceEntryDto extends ApplicationServiceEntryDto{

    blog: Blog
    userId: string
    comment: string

}