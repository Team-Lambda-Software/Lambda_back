import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { SearchBlogByTagsServiceEntryDto } from "../../dto/params/search-blog-by-tags-service-entry.dto"
import { Blog } from "src/blog/domain/blog"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"




export class SearchBlogsByTagsApplicationService implements IApplicationService<SearchBlogByTagsServiceEntryDto, Blog[]>
{

    private readonly blogRepository: IBlogRepository

    constructor ( blogRepository: IBlogRepository )
    {
        this.blogRepository = blogRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchBlogByTagsServiceEntryDto ): Promise<Result<Blog[]>>
    {
        let { offset = 0, limit = 10 } = data.pagination
        limit = limit + offset
        return await this.blogRepository.findBlogsByTags( data.tags, { offset, limit } )
    }

    get name (): string
    {
        return this.constructor.name
    }



}