import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetBlogCommentsServiceEntryDto } from "../dto/params/get-blog-comments-service-entry.dto"
import { GetBlogCommentsServiceResponseDto } from "../dto/responses/get-blog-comments-service-response.dto"
import { BlogQueryRepository } from "../../repositories/blog-query-repository.interface"




export class GetBlogCommentsService implements IApplicationService<GetBlogCommentsServiceEntryDto, GetBlogCommentsServiceResponseDto[]> 
{
    private readonly blogRepository: BlogQueryRepository

    constructor ( blogRepository: BlogQueryRepository)
    {
        this.blogRepository = blogRepository
    }

    async execute ( data: GetBlogCommentsServiceEntryDto ): Promise<Result<GetBlogCommentsServiceResponseDto[]>>
    {
        let { page = 1, perPage = 10 } = data.pagination
        page = page * perPage - perPage
        const comments = await this.blogRepository.findBlogComments( data.blogId, {page, perPage} )
        if ( !comments.isSuccess() )
        {
            return Result.fail<GetBlogCommentsServiceResponseDto[]>( comments.Error, comments.StatusCode, comments.Message )
        }
        const response: GetBlogCommentsServiceResponseDto[] = []

        for ( const comment of comments.Value )
        {
            response.push( {
                id: comment.id,
                user: comment.user.name,
                body: comment.text,
                date: comment.date
            } )
        }

        return Result.success<GetBlogCommentsServiceResponseDto[]>( response, 200)

    }

    get name (): string
    {
        return this.constructor.name
    }

}