import { Blog } from "src/blog/domain/blog"
import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { SearchBlogByTitleEntryDto } from "../../dto/params/search-blog-by-title-entry.dto"




export class SearchBlogByTitleApplicationService implements IApplicationService<SearchBlogByTitleEntryDto, Blog[]> 
{
    private readonly blogRepository: IBlogRepository

    constructor ( blogRepository: IBlogRepository )
    {
        this.blogRepository = blogRepository
    }

    async execute ( data: SearchBlogByTitleEntryDto ): Promise<Result<Blog[]>>
    {
        const { limit = 10, offset = 0 } = data.pagination
        const resultBlogs = await this.blogRepository.findBlogsByTitle( data.title, { limit, offset } )
        if ( !resultBlogs.isSuccess() )
        {
            return Result.fail<Blog[]>( resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message )
        }

        return resultBlogs

    }

    get name (): string
    {
        return this.constructor.name
    }

}