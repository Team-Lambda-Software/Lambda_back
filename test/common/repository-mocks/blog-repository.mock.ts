import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { Result } from "src/common/Domain/result-handler/Result"



export class BlogRepositoryMock implements IBlogRepository {
    
    private readonly blogs: Blog[] = []
    private readonly comments: BlogComment[] = []
    

    async findBlogById ( blogId: BlogId ): Promise<Result<Blog>>
    {
        const blog = this.blogs.find( blog => blog.Id.equals( blogId ) )
        if ( !blog ) 
            return Result.fail<Blog>( new Error('Blog not found'), 404, 'Blog not found')
        return Result.success<Blog>( blog, 200 )
    }
    
    async saveBlogAggregate ( blog: Blog ): Promise<Result<Blog>>
    {
        this.blogs.push( blog )
        return Result.success<Blog>( blog, 200 )
    }
    async addCommentToBlog ( comment: BlogComment ): Promise<Result<BlogComment>>
    {
        this.comments.push( comment )
        return Result.success<BlogComment>( comment, 200 )
    }

}