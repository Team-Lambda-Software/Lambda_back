import { Blog } from 'src/blog/domain/blog'
import { IBlogRepository } from 'src/blog/domain/repositories/blog-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { randomInt } from 'crypto'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { SearchBlogsByCategoryServiceEntryDto } from '../dto/params/search-blogs-by-category-service-entry.dto'
import { SearchBlogServiceResponseDto } from '../dto/responses/search-blog-service-response.dto'
import { OdmBlogRepository } from '../../repositories/odm-repository/odm-blog-repository'
import { OdmBlogEntity } from '../../entities/odm-entities/odm-blog.entity'
import { BlogQueryRepository } from '../../repositories/blog-query-repository.interface'

interface BlogPopularity {
    blog: OdmBlogEntity
    comments: number
}



export class SearchMostPopularBlogsByCategoryService implements IApplicationService<SearchBlogsByCategoryServiceEntryDto, SearchBlogServiceResponseDto[]>{
    private readonly blogRepository: BlogQueryRepository

    constructor ( blogRepository: BlogQueryRepository)
    {
        this.blogRepository = blogRepository

    }
    async execute ( data: SearchBlogsByCategoryServiceEntryDto ): Promise<Result<SearchBlogServiceResponseDto[]>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const blogsDict: {[key: string]: BlogPopularity} = {}
        let blogs
        if ( !data.categoryId )
            blogs = await this.blogRepository.findAllBlogs( data.pagination )
        else
            blogs = await this.blogRepository.findBlogsByCategory( data.categoryId, data.pagination )
        if ( !blogs.isSuccess() )
        {
            return Result.fail<SearchBlogServiceResponseDto[]>( blogs.Error, blogs.StatusCode, blogs.Message )
        }

        for ( const blog of blogs.Value )
        {
            const blogUsers = await this.blogRepository.findBlogCommentCount( blog.id )
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