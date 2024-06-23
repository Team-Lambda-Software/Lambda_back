import { Course } from 'src/course/domain/course'
import { ICourseRepository } from 'src/course/domain/repositories/course-repository.interface'
import { IProgressCourseRepository } from 'src/progress/domain/repositories/progress-course-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Domain/result-handler/Result'
import { SearchCourseServiceResponseDto } from '../dto/responses/search-course-service-response.dto'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { SearchCoursesByTrainerServiceEntryDto } from '../dto/param/search-courses-by-trainer-service-entry.dto'
import { OdmCourseRepository } from '../../repositories/odm-repositories/odm-course-repository'
import { OdmCourseEntity } from '../../entities/odm-entities/odm-course.entity'
import { CourseQueryRepository } from '../../repositories/course-query-repository.interface'


interface CoursePopularity {
    course: OdmCourseEntity
    users: number

}


export class SearchMostPopularCoursesByTrainerService implements IApplicationService<SearchCoursesByTrainerServiceEntryDto, SearchCourseServiceResponseDto[]>{
    private readonly courseRepository: CourseQueryRepository
    private readonly progressRepository: IProgressCourseRepository

    constructor ( courseRepository: CourseQueryRepository, progressRepository: IProgressCourseRepository)
    {
        this.courseRepository = courseRepository
        this.progressRepository = progressRepository

    }
    async execute ( data: SearchCoursesByTrainerServiceEntryDto ): Promise<Result<SearchCourseServiceResponseDto[]>>
    {
        const coursesDict: {[key: string]: CoursePopularity} = {}
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const courses = await this.courseRepository.findCoursesByTrainer( data.trainerId, data.pagination )
        if ( !courses.isSuccess() )
        {
            return Result.fail<SearchCourseServiceResponseDto[]>( courses.Error, courses.StatusCode, courses.Message )
        }

        for ( const course of courses.Value )
        {
            const courseUsers = await this.progressRepository.findUserCountInCourse( course.id )
            // console.log(courseUsers.Value)
            if ( !courseUsers.isSuccess() )
            {
                return Result.fail<SearchCourseServiceResponseDto[]>( courseUsers.Error, courseUsers.StatusCode, courseUsers.Message )
            }
            coursesDict[course.id] = {course, users: courseUsers.Value}
        }
        const sortedCourses = Object.values( coursesDict ).sort( ( a, b ) => b.users - a.users ).map( course => course.course )
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