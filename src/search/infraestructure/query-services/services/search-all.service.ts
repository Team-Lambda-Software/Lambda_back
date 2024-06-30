import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { SearchAllServiceEntryDto } from "../dto/param/search-all-service-entry.dto"
import { SearchAllServiceResponseDto } from "../dto/responses/search-all-service-response.dto"
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface"
import { BlogQueryRepository } from "src/blog/infraestructure/repositories/blog-query-repository.interface"




export class SearchAllService implements IApplicationService<SearchAllServiceEntryDto, SearchAllServiceResponseDto>
{

    private readonly courseRepository: CourseQueryRepository
    private readonly blogRepository: BlogQueryRepository

    constructor ( courseRepository: CourseQueryRepository, blogRepository: BlogQueryRepository)
    {
        this.courseRepository = courseRepository
        this.blogRepository = blogRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchAllServiceEntryDto ): Promise<Result<SearchAllServiceResponseDto>>
    {
        let { page = 1, perPage = 10 } = data.pagination
        page = page * perPage - perPage
        let resultCourses = await this.courseRepository.findCoursesByTagsAndName( data.tags, data.name, { page, perPage } )
        if ( !resultCourses.isSuccess() )
        {
            return Result.fail<SearchAllServiceResponseDto>( resultCourses.Error, resultCourses.StatusCode, resultCourses.Message )
        }
        let resultBlogs = await this.blogRepository.findBlogsByTagsAndTitle( data.tags,data.name, { page, perPage } )
        if ( !resultBlogs.isSuccess() )
        {
            return Result.fail<SearchAllServiceResponseDto>( resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message )
        }
        let responseSearch: SearchAllServiceResponseDto = { courses: [], blogs: [] }
        if ( resultCourses.Value.length > 0 )
        {
            for ( const course of resultCourses.Value )
            {
                responseSearch.courses.push( {
                    id: course.id,
                    title: course.name,
                    image: course.image,
                    date: course.date,
                    category: course.category.categoryName,
                    trainer: course.trainer.first_name + ' ' + course.trainer.first_last_name + ' ' + course.trainer.second_last_name,
                } )
            }
        }
        if ( resultBlogs.Value.length > 0 )
        {
            for ( const blog of resultBlogs.Value )
            {
                responseSearch.blogs.push( {
                    id: blog.id,
                    title: blog.title,
                    image: blog.images[ 0 ].url,
                    date: blog.publication_date,
                    category: blog.category.categoryName,
                    trainer: blog.trainer.first_name + ' ' + blog.trainer.first_last_name + ' ' + blog.trainer.second_last_name,
                } )
            }
        }
        return Result.success<SearchAllServiceResponseDto>( responseSearch, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}