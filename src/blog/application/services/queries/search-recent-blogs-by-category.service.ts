import { IBlogRepository } from 'src/blog/domain/repositories/blog-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'
import { SearchBlogsByCategoryServiceEntryDto } from '../../dto/params/search-blogs-by-category-service-entry.dto'
import { SearchBlogServiceResponseDto } from '../../dto/responses/search-blog-service-response.dto'


export class SearchRecentBlogsByCategoryApplicationService implements IApplicationService<SearchBlogsByCategoryServiceEntryDto, SearchBlogServiceResponseDto[]>{
    private readonly blogRepository: IBlogRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository

    constructor ( blogRepository: IBlogRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository)
    {
        this.blogRepository = blogRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository

    }
    async execute ( data: SearchBlogsByCategoryServiceEntryDto ): Promise<Result<SearchBlogServiceResponseDto[]>>
    {
        const blogs = await this.blogRepository.findBlogsByCategory( data.categoryId, data.pagination )
        if ( !blogs.isSuccess() )
        {
            return Result.fail<SearchBlogServiceResponseDto[]>( blogs.Error, blogs.StatusCode, blogs.Message )
        }
        const responseBlogs: SearchBlogServiceResponseDto[] = []

        for (const blog of blogs.Value){
            const category = await this.categoryRepository.findCategoryById( blog.CategoryId )
            if ( !category.isSuccess() )
            {
                return Result.fail<SearchBlogServiceResponseDto[]>( category.Error, category.StatusCode, category.Message )
            }
            const trainer = await this.trainerRepository.findTrainerById( blog.Trainer.Id )
            if ( !trainer.isSuccess() )
            {
                return Result.fail<SearchBlogServiceResponseDto[]>( trainer.Error, trainer.StatusCode, trainer.Message )
            }
            responseBlogs.push({
                id: blog.Id,
                title: blog.Title,
                image: blog.Images[0].Url,
                date: blog.PublicationDate,
                category: category.Value.Name,
                trainer: trainer.Value.FirstName + ' ' + trainer.Value.FirstLastName + ' ' + trainer.Value.SecondLastName,
            })
        }

        return Result.success<SearchBlogServiceResponseDto[]>( responseBlogs, 200 )
    }
    get name (): string
    {
        return this.constructor.name
    }
}