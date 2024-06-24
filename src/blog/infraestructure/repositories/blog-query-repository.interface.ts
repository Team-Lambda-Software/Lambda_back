import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmBlogEntity } from "../entities/odm-entities/odm-blog.entity"
import { Result } from "src/common/Domain/result-handler/Result"
import { OdmBlogCommentEntity } from "../entities/odm-entities/odm-blog-comment.entity"


export interface BlogQueryRepository {
    saveBlog ( blog: OdmBlogEntity ): Promise<void>
    

    createBlogComment (blogComment: OdmBlogCommentEntity): Promise<void>
    

    findBlogsByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>
    

    findBlogsByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>
    

    findBlogComments ( blogId: string, pagination: PaginationDto ): Promise<Result<OdmBlogCommentEntity[]>>
    

    findBlogCommentCount ( blogId: string ): Promise<Result<number>>
    

    findBlogById ( id: string ): Promise<Result<OdmBlogEntity>>
    
    findAllBlogs ( pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>
    

    findBlogsByTagsAndTitle ( searchTags: string[], title: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>

    findBlogCountByTrainer ( trainerId: string ): Promise<Result<number>>

    findBlogCountByCategory ( categoryId: string ): Promise<Result<number>>

    findBlogTags (): Promise<Result<string[]>>
    
}