import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"



export class BlogRepositoryMock implements IBlogRepository {
    
    private readonly blogs: Blog[] = []
    private readonly comments: BlogComment[] = []
    
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