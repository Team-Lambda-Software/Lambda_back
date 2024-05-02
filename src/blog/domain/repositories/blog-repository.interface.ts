import { Result } from "src/common/Application/result-handler/Result"
import { Blog } from "../blog"
import { BlogComment } from "../entities/blog-comment"




export interface IBlogRepository 
{

    findBlogById ( id: string ): Promise<Result<Blog>>
    findBlogsByTitle ( title: string ): Promise<Result<Blog[]>>
    findBlogsByCategory( categoryId: string ): Promise<Result<Blog[]>>
    findBlogComments (blogId: string): Promise<Result<BlogComment[]>>
    addCommentToBlog( comment: BlogComment ): Promise<Result<BlogComment>>
    findAllTrainerBlogs( trainerId: string ): Promise<Result<Blog[]>>

}