import { Blog } from 'src/blog/domain/blog'
import { IBlogRepository } from 'src/blog/domain/repositories/blog-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { randomInt } from 'crypto'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { SearchBlogServiceResponseDto } from '../../dto/responses/search-blog-service-response.dto'
import { SearchBlogsByTrainerServiceEntryDto } from '../../dto/params/search-blogs-by-trainer-service-entry.dto'

interface BlogPopularity {
    blog: Blog
    comments: number
}



export class SearchMostPopularBlogsByTrainerApplicationService implements IApplicationService<SearchBlogsByTrainerServiceEntryDto, SearchBlogServiceResponseDto[]>{
    private readonly blogRepository: IBlogRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository

    constructor ( blogRepository: IBlogRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository)
    {
        this.blogRepository = blogRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository

    }
    async execute ( data: SearchBlogsByTrainerServiceEntryDto ): Promise<Result<SearchBlogServiceResponseDto[]>>
    {
        const blogsDict: {[key: string]: BlogPopularity} = {}
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const blogs = await this.blogRepository.findBlogsByTrainer( data.trainerId, data.pagination )
        if ( !blogs.isSuccess() )
        {
            return Result.fail<SearchBlogServiceResponseDto[]>( blogs.Error, blogs.StatusCode, blogs.Message )
        }

        for ( const blog of blogs.Value )
        {
            const blogUsers = await this.blogRepository.findBlogCommentCount( blog.Id.Value )
            console.log(blogUsers.Value)
            if ( !blogUsers.isSuccess() )
            {
                return Result.fail<SearchBlogServiceResponseDto[]>( blogUsers.Error, blogUsers.StatusCode, blogUsers.Message )
            }
            blogsDict[blog.Id.Value] = {blog, comments: blogUsers.Value}
        }
        const sortedblogs = Object.values( blogsDict ).sort( ( a, b ) => b.comments - a.comments ).map( blog => blog.blog )
        const responseblogs: SearchBlogServiceResponseDto[] = []

        for (const blog of sortedblogs){
            const category = await this.categoryRepository.findCategoryById( blog.CategoryId.Value )
            if ( !category.isSuccess() )
            {
                return Result.fail<SearchBlogServiceResponseDto[]>( category.Error, category.StatusCode, category.Message )
            }
            const trainer = await this.trainerRepository.findTrainerById( blog.Trainer.Id )
            if ( !trainer.isSuccess() )
            {
                return Result.fail<SearchBlogServiceResponseDto[]>( trainer.Error, trainer.StatusCode, trainer.Message )
            }
            responseblogs.push({
                id: blog.Id.Value,
                title: blog.Title.Value,
                image: blog.Images[0].Value,
                date: blog.PublicationDate.Value,
                category: category.Value.Name.Value,
                trainer: trainer.Value.FirstName + ' ' + trainer.Value.FirstLastName + ' ' + trainer.Value.SecondLastName,
            })
        }

        return Result.success<SearchBlogServiceResponseDto[]>( responseblogs, 200 )
    }
    get name (): string
    {
        return this.constructor.name
    }
}