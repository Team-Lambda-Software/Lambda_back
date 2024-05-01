import { Result } from "src/common/Application/result-handler/Result"
import { Blog } from "../blog"
import { BlogComment } from "../entities/blog-comment"




export interface IBlogRepository 
{

    findBlogById ( id: string ): Promise<Result<Blog>>
    findBlogsByName ( name: string ): Promise<Result<Blog[]>>
    findBlogsByCategory( categoryId: string ): Promise<Result<Blog[]>>
    findBlogComments (blogId: string): Promise<Result<BlogComment[]>>
    addCommentToBlog( comment: BlogComment ): Promise<Result<BlogComment>>

}