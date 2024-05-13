import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { GetBlogServiceEntryDto } from "../../dto/params/get-blog-service-entry.dto"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { GetBlogServiceResponseDto } from "../../dto/responses/get-blog-service-response.dto"




export class GetBlogApplicationService implements IApplicationService<GetBlogServiceEntryDto, GetBlogServiceResponseDto> 
{
    private readonly blogRepository: IBlogRepository

    constructor ( blogRepository: IBlogRepository )
    {
        this.blogRepository = blogRepository
    }

    async execute ( data: GetBlogServiceEntryDto ): Promise<Result<GetBlogServiceResponseDto>>
    {
        const resultBlog = await this.blogRepository.findBlogById( data.blogId )
        if ( !resultBlog.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( resultBlog.Error, resultBlog.StatusCode, resultBlog.Message )
        }
        const blog = resultBlog.Value
        const { limit = 10, offset = 0 } = data.commentPagination
        const resultComments = await this.blogRepository.findBlogComments( blog.Id, { limit, offset } )
        if ( !resultComments.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( resultComments.Error, resultComments.StatusCode, resultComments.Message )
        }
        const comments = resultComments.Value
        const response: GetBlogServiceResponseDto = { blog, comments }

        return Result.success<GetBlogServiceResponseDto>( response, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}