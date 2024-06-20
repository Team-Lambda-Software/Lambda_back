import { Blog } from 'src/blog/domain/blog'
import { IBlogRepository } from 'src/blog/domain/repositories/blog-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { randomInt } from 'crypto'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { SearchBlogsByTrainerServiceEntryDto } from '../dto/params/search-blogs-by-trainer-service-entry.dto'
import { SearchBlogServiceResponseDto } from '../dto/responses/search-blog-service-response.dto'
import { OdmBlogRepository } from '../../repositories/odm-repository/odm-blog-repository'
import { OdmBlogEntity } from '../../entities/odm-entities/odm-blog.entity'

interface BlogPopularity {
    blog: OdmBlogEntity
    comments: number
}



export class SearchMostPopularBlogsByTrainerService implements IApplicationService<SearchBlogsByTrainerServiceEntryDto, SearchBlogServiceResponseDto[]>{
    private readonly blogRepository: OdmBlogRepository

    constructor ( blogRepository: OdmBlogRepository)
    {
        this.blogRepository = blogRepository

    }
    async execute ( data: SearchBlogsByTrainerServiceEntryDto ): Promise<Result<SearchBlogServiceResponseDto[]>>
    {
        const blogsDict: {[key: string]: BlogPopularity} = {}
        const blogs = await this.blogRepository.findBlogsByTrainer( data.trainerId, data.pagination )
        if ( !blogs.isSuccess() )
        {
            return Result.fail<SearchBlogServiceResponseDto[]>( blogs.Error, blogs.StatusCode, blogs.Message )
        }

        for ( const blog of blogs.Value )
        {
            const blogUsers = await this.blogRepository.findBlogCommentCount( blog.id )
            
            console.log(blogUsers.Value)
            if ( !blogUsers.isSuccess() )
            {
                return Result.fail<SearchBlogServiceResponseDto[]>( blogUsers.Error, blogUsers.StatusCode, blogUsers.Message )
            }
            blogsDict[blog.id] = {blog, comments: blogUsers.Value}
        }
        const sortedblogs = Object.values( blogsDict ).sort( ( a, b ) => b.comments - a.comments ).map( blog => blog.blog )
        const responseBlogs: SearchBlogServiceResponseDto[] = []

        for (const blog of sortedblogs){
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