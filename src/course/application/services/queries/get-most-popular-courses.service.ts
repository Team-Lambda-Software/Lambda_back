import { Course } from 'src/course/domain/course'
import { ICourseRepository } from 'src/course/domain/repositories/course-repository.interface'
import { IProgressCourseRepository } from 'src/progress/domain/repositories/progress-course-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { GetMostPopularCoursesServiceEntryDto } from '../../dto/param/get-most-popular-courses-service-entry.dto'
import { Result } from 'src/common/Application/result-handler/Result'
import { randomInt } from 'crypto'


interface CoursePopularity {
    course: Course
    users: number

}


export class GetMostPopularCoursesApplicationService implements IApplicationService<GetMostPopularCoursesServiceEntryDto, Course[]>{
    private readonly courseRepository: ICourseRepository
    private readonly progressRepository: IProgressCourseRepository

    constructor ( courseRepository: ICourseRepository, progressRepository: IProgressCourseRepository)
    {
        this.courseRepository = courseRepository
        this.progressRepository = progressRepository

    }
    async execute ( data: GetMostPopularCoursesServiceEntryDto ): Promise<Result<Course[]>>
    {
        const coursesDict: {[key: string]: CoursePopularity} = {}
        const courses = await this.courseRepository.findCoursesByName( " ",data.pagination )
        if ( !courses.isSuccess() )
        {
            return Result.fail<Course[]>( courses.Error, courses.StatusCode, courses.Message )
        }

        for ( const course of courses.Value )
        {
            //const courseUsers = await this.progressRepository.findUserCountInCourse( course.Id )
            const courseUsers = Result.success(randomInt( 0, 20 ),200)
            if ( !courseUsers.isSuccess() )
            {
                return Result.fail<Course[]>( courseUsers.Error, courseUsers.StatusCode, courseUsers.Message )
            }
            coursesDict[course.Id] = {course, users: courseUsers.Value}
        }
        const sortedCourses = Object.values( coursesDict ).sort( ( a, b ) => b.users - a.users ).map( course => course.course )
        return Result.success<Course[]>( sortedCourses, 200 )
    }
    get name (): string
    {
        return this.constructor.name
    }
}