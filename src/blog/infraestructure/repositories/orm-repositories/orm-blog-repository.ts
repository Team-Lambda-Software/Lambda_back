import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Application/result-handler/Result"



export class OrmBlogRepository implements IBlogRepository
{

    findBlogById ( id: string ): Promise<Result<Blog>>
    {
        throw new Error( "Method not implemented." )
    }

    findBlogsByName ( name: string ): Promise<Result<Blog[]>>
    {
        throw new Error( "Method not implemented." )
    }

    findBlogsByCategory ( categoryId: string ): Promise<Result<Blog[]>>
    {
        throw new Error( "Method not implemented." )
    }

    findBlogComments ( blogId: string ): Promise<Result<BlogComment[]>>
    {
        throw new Error( "Method not implemented." )
    }
    
    addCommentToBlog ( comment: BlogComment ): Promise<Result<BlogComment>>
    {
        throw new Error( "Method not implemented." )
    }

}