import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { SearchCoursesByCategoryServiceEntryDto } from '../dto/param/search-courses-by-category-service-entry.dto'
import { Result } from 'src/common/Domain/result-handler/Result'
import { SearchCourseServiceResponseDto } from '../dto/responses/search-course-service-response.dto'
import { CourseQueryRepository } from '../../repositories/course-query-repository.interface'


export class SearchRecentCoursesByCategoryService implements IApplicationService<SearchCoursesByCategoryServiceEntryDto, SearchCourseServiceResponseDto[]>{
    private readonly courseRepository: CourseQueryRepository

    constructor ( courseRepository: CourseQueryRepository)
    {
        this.courseRepository = courseRepository

    }
    async execute ( data: SearchCoursesByCategoryServiceEntryDto ): Promise<Result<SearchCourseServiceResponseDto[]>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const courses = await this.courseRepository.findCoursesByCategory( data.categoryId, data.pagination )
        if ( !courses.isSuccess() )
        {
            return Result.fail<SearchCourseServiceResponseDto[]>( courses.Error, courses.StatusCode, courses.Message )
        }
        const responseCourses: SearchCourseServiceResponseDto[] = []

        for (const course of courses.Value){
            
            responseCourses.push({
                id: course.id,
                title: course.name,
                image: course.image,
                date: course.date,
                category: course.category.categoryName,
                trainer: course.trainer.first_name + ' ' + course.trainer.first_last_name + ' ' + course.trainer.second_last_name,
            })
        }

        return Result.success<SearchCourseServiceResponseDto[]>( responseCourses, 200 )
    }
    get name (): string
    {
        return this.constructor.name
    }
}