import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { SearchAllServiceEntryDto } from "../dto/param/search-all-service-entry.dto"
import { SearchAllServiceResponseDto } from "../dto/responses/search-all-service-response.dto"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"




export class SearchCourseApplicationService implements IApplicationService<SearchAllServiceEntryDto, SearchAllServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly blogRepository: IBlogRepository

    constructor ( courseRepository: ICourseRepository, blogRepository: IBlogRepository)
    {
        this.courseRepository = courseRepository
        this.blogRepository = blogRepository

    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchAllServiceEntryDto ): Promise<Result<SearchAllServiceResponseDto>>
    {
        const { offset = 0, limit = 10 } = data.pagination
        const resultCourses = await this.courseRepository.findCoursesByName( data.name, { offset, limit } )
        if (!resultCourses.isSuccess())
            return Result.fail<SearchAllServiceResponseDto>(resultCourses.Error, resultCourses.StatusCode, resultCourses.Message)
        const resultBlogs = await this.blogRepository.findBlogsByTitle( data.name, { offset, limit } )
        if (!resultBlogs.isSuccess())
            return Result.fail<SearchAllServiceResponseDto>(resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message)

        return Result.success<SearchAllServiceResponseDto>({courses: resultCourses.Value, blogs: resultBlogs.Value}, 200)
    }

    get name (): string
    {
        return this.constructor.name
    }



}