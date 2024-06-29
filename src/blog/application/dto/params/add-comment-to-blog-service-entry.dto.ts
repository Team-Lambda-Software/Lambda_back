import { Blog } from "src/blog/domain/blog"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"




export interface AddCommentToBlogServiceEntryDto extends ApplicationServiceEntryDto{

    blogId: string
    userId: string
    comment: string

}