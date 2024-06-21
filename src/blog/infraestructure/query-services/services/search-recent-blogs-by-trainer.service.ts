import { IBlogRepository } from 'src/blog/domain/repositories/blog-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'
import { SearchBlogsByTrainerServiceEntryDto } from '../dto/params/search-blogs-by-trainer-service-entry.dto'
import { SearchBlogServiceResponseDto } from '../dto/responses/search-blog-service-response.dto'
import { OdmBlogRepository } from '../../repositories/odm-repository/odm-blog-repository'


export class SearchRecentBlogsByTrainerService implements IApplicationService<SearchBlogsByTrainerServiceEntryDto, SearchBlogServiceResponseDto[]>{
    private readonly blogRepository: OdmBlogRepository

    constructor ( blogRepository: OdmBlogRepository)
    {
        this.blogRepository = blogRepository

    }
    async execute ( data: SearchBlogsByTrainerServiceEntryDto ): Promise<Result<SearchBlogServiceResponseDto[]>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const blogs = await this.blogRepository.findBlogsByTrainer( data.trainerId, data.pagination )
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