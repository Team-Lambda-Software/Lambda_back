import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { GetCourseServiceEntryDto } from "../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { GetCourseServiceResponseDto } from "../dto/responses/get-course-service-response.dto"
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface"
import { ProgressSection } from "src/progress/domain/entities/progress-section"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { OdmCourseRepository } from "../../repositories/odm-repositories/odm-course-repository"
import { CourseQueryRepository } from "../../repositories/course-query-repository.interface"




export class GetCourseService implements IApplicationService<GetCourseServiceEntryDto, GetCourseServiceResponseDto>
{

    private readonly courseRepository: CourseQueryRepository


    constructor ( courseRepository: CourseQueryRepository )
    {

        this.courseRepository = courseRepository

    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: GetCourseServiceEntryDto ): Promise<Result<GetCourseServiceResponseDto>>
    {
        const resultCourse = await this.courseRepository.findCourseById( data.courseId )
        if ( !resultCourse.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( resultCourse.Error, resultCourse.StatusCode, resultCourse.Message )
        }

        const course = resultCourse.Value
        
        let responseCourse: GetCourseServiceResponseDto = {
            title: course.name,
            description: course.description,
            category: course.category.categoryName,
            image: course.image,
            trainer: {
                id: course.trainer.id,
                name: course.trainer.first_name + ' ' + course.trainer.first_last_name + ' ' + course.trainer.second_last_name
            },
            level: course.level.toString(),
            durationWeeks: course.weeks_duration,
            durationMinutes: course.minutes_per_section,
            tags: course.tags,
            date: course.date,
            lessons: course.sections.map( section => ( { id: section.id, title: section.name, content: section.description, video: section.video } ) )
        }

        return Result.success<GetCourseServiceResponseDto>( responseCourse, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}