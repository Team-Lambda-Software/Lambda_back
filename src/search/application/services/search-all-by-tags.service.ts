import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Blog } from "src/blog/domain/blog"
import { SearchAllByTagsServiceEntryDto } from "../dto/param/search-all-by-tags-service-entry.dto"
import { SearchAllServiceResponseDto } from "../dto/responses/search-all-service-response.dto"




export class SearchAllByTagsApplicationService implements IApplicationService<SearchAllByTagsServiceEntryDto, SearchAllServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly blogRepository: IBlogRepository

    constructor ( courseRepository: ICourseRepository, blogRepository: IBlogRepository )
    {
        this.courseRepository = courseRepository
        this.blogRepository = blogRepository

    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchAllByTagsServiceEntryDto ): Promise<Result<SearchAllServiceResponseDto>>
    {
        const { page = 0, perPage = 10 } = data.pagination
        let resultCourses = await this.courseRepository.findCoursesByTags( data.tags, { page, perPage } )
        if ( !resultCourses.isSuccess() )
        {
            if ( resultCourses.StatusCode != 404 )
                return Result.fail<SearchAllServiceResponseDto>( resultCourses.Error, resultCourses.StatusCode, resultCourses.Message )
            resultCourses = Result.success<Course[]>( [], 200 )
        }
        let resultBlogs = await this.blogRepository.findBlogsByTags( data.tags, { page, perPage } )
        if ( !resultBlogs.isSuccess() ){
            if ( resultBlogs.StatusCode != 404 )
                return Result.fail<SearchAllServiceResponseDto>( resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message )
            resultBlogs = Result.success<Blog[]>( [], 200 )
        }

        return Result.success<SearchAllServiceResponseDto>( { courses: resultCourses.Value, blogs: resultBlogs.Value }, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}