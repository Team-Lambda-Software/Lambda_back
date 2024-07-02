import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { SearchBlogsByCategoryServiceEntryDto } from '../dto/params/search-blogs-by-category-service-entry.dto'
import { SearchBlogServiceResponseDto } from '../dto/responses/search-blog-service-response.dto'
import { BlogQueryRepository } from '../../repositories/blog-query-repository.interface'


export class SearchRecentBlogsByCategoryService implements IApplicationService<SearchBlogsByCategoryServiceEntryDto, SearchBlogServiceResponseDto[]>{
    
    private readonly blogRepository: BlogQueryRepository

    constructor ( blogRepository: BlogQueryRepository)
    {
        this.blogRepository = blogRepository

    }
    async execute ( data: SearchBlogsByCategoryServiceEntryDto ): Promise<Result<SearchBlogServiceResponseDto[]>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        let blogs
        if ( !data.categoryId )
            blogs = await this.blogRepository.findAllBlogs( data.pagination )
        else
            blogs = await this.blogRepository.findBlogsByCategory( data.categoryId, data.pagination )
        if ( !blogs.isSuccess() )
        {
            return Result.fail<SearchBlogServiceResponseDto[]>( blogs.Error, blogs.StatusCode, blogs.Message )
        }
        const responseBlogs: SearchBlogServiceResponseDto[] = []

        for (const blog of blogs.Value){
            responseBlogs.push({
                id: blog.id,
                title: blog.title,
                image: blog.images[0].url,
                date: blog.publication_date,
                category: blog.category.categoryName,
                trainer: blog.trainer.first_name + ' ' + blog.trainer.first_last_name + ' ' + blog.trainer.second_last_name,
            })
        }

        return Result.success<SearchBlogServiceResponseDto[]>( responseBlogs, 200 )
    }
    get name (): string
    {
        return this.constructor.name
    }
}