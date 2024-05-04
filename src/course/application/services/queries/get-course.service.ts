import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { GetCourseServiceEntryDto } from "../../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"




export class GetCourseApplicationService implements IApplicationService<GetCourseServiceEntryDto, Course>
{

    private readonly courseRepository: ICourseRepository

    constructor ( courseRepository: ICourseRepository )
    {
        this.courseRepository = courseRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: GetCourseServiceEntryDto ): Promise<Result<Course>>
    {
        const resultCourse = await this.courseRepository.findCourseById( data.courseId )
        if ( !resultCourse.isSuccess() )
        {
            return Result.fail<Course>( resultCourse.Error, resultCourse.StatusCode, resultCourse.Message )
        }

        const course = resultCourse.Value
        const {offset = 0, limit = 10} = data.sectionPagination
        const resultSections = await this.courseRepository.findCourseSections( course.Id, {offset, limit})
        if ( !resultSections.isSuccess() )
        {
            return Result.fail<Course>( resultSections.Error, resultSections.StatusCode, resultSections.Message )
        }
        course.changeSections( resultSections.Value )

        return Result.success<Course>( course , 200)
    }

    get name (): string
    {
        return this.constructor.name
    }



}