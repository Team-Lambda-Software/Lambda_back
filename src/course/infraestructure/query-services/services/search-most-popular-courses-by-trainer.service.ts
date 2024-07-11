import { IProgressCourseRepository } from 'src/progress/domain/repositories/progress-course-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { SearchCourseServiceResponseDto } from '../dto/responses/search-course-service-response.dto'
import { SearchCoursesByTrainerServiceEntryDto } from '../dto/param/search-courses-by-trainer-service-entry.dto'
import { OdmCourseEntity } from '../../entities/odm-entities/odm-course.entity'
import { CourseQueryRepository } from '../../repositories/course-query-repository.interface'


export class SearchMostPopularCoursesByTrainerService implements IApplicationService<SearchCoursesByTrainerServiceEntryDto, SearchCourseServiceResponseDto[]>{
    private readonly courseRepository: CourseQueryRepository

    constructor ( courseRepository: CourseQueryRepository)
    {
        this.courseRepository = courseRepository

    }
    async execute ( data: SearchCoursesByTrainerServiceEntryDto ): Promise<Result<SearchCourseServiceResponseDto[]>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const courses = await this.courseRepository.findCoursesByTrainerOrderByPopularity( data.trainerId, data.pagination )
        if ( !courses.isSuccess() )
        {
            return Result.fail<SearchCourseServiceResponseDto[]>( courses.Error, courses.StatusCode, courses.Message )
        }

        
        const sortedCourses = courses.Value
        const responseCourses: SearchCourseServiceResponseDto[] = []

        for (const course of sortedCourses){
           
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