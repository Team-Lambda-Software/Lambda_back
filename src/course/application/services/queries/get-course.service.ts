import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { GetCourseServiceEntryDto } from "../../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { GetCourseServiceResponseDto } from "../../dto/responses/get-course-service-response.dto"
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface"
import { ProgressSection } from "src/progress/domain/entities/progress-section"




export class GetCourseApplicationService implements IApplicationService<GetCourseServiceEntryDto, GetCourseServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly progressRepository: IProgressCourseRepository

    constructor ( courseRepository: ICourseRepository, progressRepository: IProgressCourseRepository)
    {
        this.courseRepository = courseRepository
        this.progressRepository = progressRepository

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
        const resultSections = await this.courseRepository.findCourseSections( course.Id )
        if ( !resultSections.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( resultSections.Error, resultSections.StatusCode, resultSections.Message )
        }
        course.changeSections( resultSections.Value )

        // let resultProgress = await this.progressRepository.getCourseProgressById( data.userId, data.courseId )

        // const courseProgress = resultProgress.Value
        // const completePercent = courseProgress.CompletionPercent
        // const resultCourseProgress = {progress: courseProgress, completionPercent: completePercent}
        //let sectionsProgress: {progress: ProgressSection, completionPercent: number}[] = []
        // for ( const section of course.Sections )
        // {
        //     const resultSectionProgress = await this.progressRepository.getSectionProgressById( data.userId, section.Id )
        //     if ( resultSectionProgress.isSuccess() )
        //     {
        //         sectionsProgress.push({ progress: resultSectionProgress.Value, completionPercent: resultSectionProgress.Value.CompletionPercent})
        //     }
        // }
        let responseCourse: GetCourseServiceResponseDto = {
            title: course.Name,
            description: course.Description,
            category: course.CategoryId,
            image: course.Image.Url,
            trainer: {
                id: course.Trainer.Id,
                name: course.Trainer.FirstName + " " + course.Trainer.FirstLastName + " " + course.Trainer.SecondLastName
            },
            level: course.Level.toString(),
            durationWeeks: course.WeeksDuration,
            durationMinutes: course.MinutesDuration,
            tags: course.Tags,
            date: course.Date,
            lessons: []
        }
        for ( const section of course.Sections )
        {
            responseCourse.lessons.push({
                id: section.Id,
                title: section.Name,
                content: section.Paragraph,
                video: section.Video ? section.Video.Url : null,
                image: section.Image ? section.Image.Url : null
            })
        }

        return Result.success<GetCourseServiceResponseDto>( responseCourse , 200)
    }

    get name (): string
    {
        return this.constructor.name
    }



}