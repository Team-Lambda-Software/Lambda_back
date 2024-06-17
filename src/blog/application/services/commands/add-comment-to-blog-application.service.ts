import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { AddCommentToBlogServiceEntryDto } from "../../dto/params/add-comment-to-blog-service-entry.dto"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { BlogCommentId } from "src/blog/domain/entities/value-objects/blog-comment-id"
import { BlogCommentText } from "src/blog/domain/entities/value-objects/blog-comment-text"
import { BlogCommentDate } from "src/blog/domain/entities/value-objects/blog-comment-date"




export class AddCommentToBlogApplicationService implements IApplicationService<AddCommentToBlogServiceEntryDto, string>
{

    private readonly blogRepository: IBlogRepository
    private readonly idGenerator: IdGenerator<string>

    constructor ( blogRepository: IBlogRepository, idGenerator: IdGenerator<string> )
    {
        this.idGenerator = idGenerator
        this.blogRepository = blogRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: AddCommentToBlogServiceEntryDto ): Promise<Result<string>>
    {
        const blog = await this.blogRepository.findBlogById( data.blogId )
        if ( !blog.isSuccess() )
        {
            return Result.fail<string>( blog.Error, blog.StatusCode, blog.Message )
        }
        const blogValue = blog.Value
        const comment = blogValue.createComment( BlogCommentId.create(await this.idGenerator.generateId()), data.userId, BlogCommentText.create(data.comment), BlogCommentDate.create(new Date()) )
        const result = await this.blogRepository.addCommentToBlog( comment )
        if ( !result.isSuccess() )
        {
            return Result.fail<string>( result.Error, result.StatusCode, result.Message )
        }
        return Result.success<string>("comentario agregado con exito",200)
    }

    get name (): string
    {
        return this.constructor.name
    }



}