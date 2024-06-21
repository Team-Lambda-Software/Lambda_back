import { ICourseRepository } from 'src/course/domain/repositories/course-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { SearchCourseServiceResponseDto } from '../dto/responses/search-course-service-response.dto'
import { SearchCoursesByTrainerServiceEntryDto } from '../dto/param/search-courses-by-trainer-service-entry.dto'
import { OdmCourseRepository } from '../../repositories/odm-repositories/odm-course-repository'


export class SearchRecentCoursesByTrainerService implements IApplicationService<SearchCoursesByTrainerServiceEntryDto, SearchCourseServiceResponseDto[]>{
    private readonly courseRepository: OdmCourseRepository

    constructor ( courseRepository: OdmCourseRepository)
    {
        this.courseRepository = courseRepository

    }
    async execute ( data: SearchCoursesByTrainerServiceEntryDto ): Promise<Result<SearchCourseServiceResponseDto[]>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const courses = await this.courseRepository.findCoursesByTrainer( data.trainerId, data.pagination )
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