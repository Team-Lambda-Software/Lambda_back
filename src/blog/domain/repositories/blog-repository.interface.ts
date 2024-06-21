import { Result } from "src/common/Domain/result-handler/Result"
import { Blog } from "../blog"
import { BlogComment } from "../entities/blog-comment"




export interface IBlogRepository 
{

    saveBlogAggregate ( blog: Blog ): Promise<Result<Blog>>
    addCommentToBlog( comment: BlogComment ): Promise<Result<BlogComment>>

}