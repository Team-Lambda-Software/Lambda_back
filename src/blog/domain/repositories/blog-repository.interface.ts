import { Result } from "src/common/Application/result-handler/Result"
import { Blog } from "../blog"
import { BlogComment } from "../entities/blog-comment"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"




export interface IBlogRepository 
{

    findBlogById ( id: string ): Promise<Result<Blog>>
    findBlogsByTitle ( title: string, pagination: PaginationDto ): Promise<Result<Blog[]>>
    findBlogsByCategory( categoryId: string, pagination: PaginationDto ): Promise<Result<Blog[]>>
    findBlogComments (blogId: string, pagination: PaginationDto): Promise<Result<BlogComment[]>>
    addCommentToBlog( comment: BlogComment ): Promise<Result<BlogComment>>
    findAllTrainerBlogs( trainerId: string, pagination: PaginationDto ): Promise<Result<Blog[]>>

}