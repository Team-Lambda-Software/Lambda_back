import { Course } from 'src/course/domain/course'
import { ICourseRepository } from 'src/course/domain/repositories/course-repository.interface'
import { IProgressCourseRepository } from 'src/progress/domain/repositories/progress-course-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { GetMostPopularCoursesByCategoryServiceEntryDto } from '../../dto/param/get-most-popular-courses-by-category-service-entry.dto'
import { Result } from 'src/common/Application/result-handler/Result'
import { randomInt } from 'crypto'
import { SearchCourseServiceResponseDto } from '../../dto/responses/search-course-service-response.dto'


interface CoursePopularity {
    course: Course
    users: number

}


export class GetMostPopularCoursesByCategoryApplicationService implements IApplicationService<GetMostPopularCoursesByCategoryServiceEntryDto, SearchCourseServiceResponseDto[]>{
    private readonly courseRepository: ICourseRepository
    private readonly progressRepository: IProgressCourseRepository

    constructor ( courseRepository: ICourseRepository, progressRepository: IProgressCourseRepository)
    {
        this.courseRepository = courseRepository
        this.progressRepository = progressRepository

    }
    async execute ( data: GetMostPopularCoursesByCategoryServiceEntryDto ): Promise<Result<SearchCourseServiceResponseDto[]>>
    {
        const coursesDict: {[key: string]: CoursePopularity} = {}
        const courses = await this.courseRepository.findCoursesByCategory( data.categoryId, data.pagination )
        if ( !courses.isSuccess() )
        {
            return Result.fail<SearchCourseServiceResponseDto[]>( courses.Error, courses.StatusCode, courses.Message )
        }

        for ( const course of courses.Value )
        {
            const courseUsers = await this.progressRepository.findUserCountInCourse( course.Id )
            console.log(courseUsers.Value)
            if ( !courseUsers.isSuccess() )
            {
                return Result.fail<SearchCourseServiceResponseDto[]>( courseUsers.Error, courseUsers.StatusCode, courseUsers.Message )
            }
            coursesDict[course.Id] = {course, users: courseUsers.Value}
        }
        const sortedCourses = Object.values( coursesDict ).sort( ( a, b ) => b.users - a.users ).map( course => course.course )
        const responseCourses: SearchCourseServiceResponseDto[] = []

        for (const course of sortedCourses){
            responseCourses.push({
                id: course.Id,
                title: course.Name,
                image: course.Image.Url,
                date: course.Date,
                category: course.CategoryId,
                trainer: course.Trainer.Id,
            })
        }

        return Result.success<SearchCourseServiceResponseDto[]>( responseCourses, 200 )
    }
    get name (): string
    {
        return this.constructor.name
    }
}