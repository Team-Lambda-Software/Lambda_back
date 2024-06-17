import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { AddCommentToBlogServiceEntryDto } from "../../dto/params/add-comment-to-blog-service-entry.dto"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"




export class AddCommentToBlogApplicationService implements IApplicationService<AddCommentToBlogServiceEntryDto, BlogComment>
{

    private readonly blogRepository: IBlogRepository
    private readonly idGenerator: IdGenerator<string>

    constructor ( blogRepository: IBlogRepository, idGenerator: IdGenerator<string> )
    {
        this.idGenerator = idGenerator
        this.blogRepository = blogRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: AddCommentToBlogServiceEntryDto ): Promise<Result<BlogComment>>
    {
        const blog = await this.blogRepository.findBlogById( data.blogId )
        if ( !blog.isSuccess() )
        {
            return Result.fail<BlogComment>( blog.Error, blog.StatusCode, blog.Message )
        }
        
        const comment = BlogComment.create( await this.idGenerator.generateId(), data.userId, data.comment, new Date(), data.blogId )
        const result = await this.blogRepository.addCommentToBlog( comment )
        if ( !result.isSuccess() )
        {
            return Result.fail<BlogComment>( result.Error, result.StatusCode, result.Message )
        }
        return result
    }

    get name (): string
    {
        return this.constructor.name
    }



}