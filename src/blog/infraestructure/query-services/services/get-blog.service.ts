import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetBlogServiceEntryDto } from "../dto/params/get-blog-service-entry.dto"
import { GetBlogServiceResponseDto } from "../dto/responses/get-blog-service-response.dto"
import { BlogQueryRepository } from "../../repositories/blog-query-repository.interface"




export class GetBlogService implements IApplicationService<GetBlogServiceEntryDto, GetBlogServiceResponseDto> 
{
    private readonly blogRepository: BlogQueryRepository

    constructor ( blogRepository: BlogQueryRepository)
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
        
        const response: GetBlogServiceResponseDto = {
            id: blog.id,
            title: blog.title,
            description: blog.body,
            category: blog.category.categoryName,
            images: blog.images.map( image => image.url ),
            trainer: {
                id: blog.trainer.id,
                name: blog.trainer.first_name + ' ' + blog.trainer.first_last_name + ' ' + blog.trainer.second_last_name
            },
            tags: blog.tags,
            date: blog.publication_date
        }

        return Result.success<GetBlogServiceResponseDto>( response, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}