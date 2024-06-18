import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { GetCourseServiceEntryDto } from "../../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { GetCourseServiceResponseDto } from "../../dto/responses/get-course-service-response.dto"
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface"
import { ProgressSection } from "src/progress/domain/entities/progress-section"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"




export class GetCourseApplicationService implements IApplicationService<GetCourseServiceEntryDto, GetCourseServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly progressRepository: IProgressCourseRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository


    constructor ( courseRepository: ICourseRepository, progressRepository: IProgressCourseRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository )
    {

        this.courseRepository = courseRepository
        this.progressRepository = progressRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository

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
        const resultSections = await this.courseRepository.findCourseSections( course.Id.Value )
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
        const category = await this.categoryRepository.findCategoryById( course.CategoryId.Value )
        if ( !category.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( category.Error, category.StatusCode, category.Message )
        }
        const trainer = await this.trainerRepository.findTrainerById( course.Trainer.Id )
        if ( !trainer.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( trainer.Error, trainer.StatusCode, trainer.Message )
        }
        let responseCourse: GetCourseServiceResponseDto = {
            title: course.Name.Value,
            description: course.Description.Value,
            category: category.Value.Name.Value,
            image: course.Image.Value,
            trainer: {
                id: trainer.Value.Id,
                name: trainer.Value.FirstName + " " + trainer.Value.FirstLastName + " " + trainer.Value.SecondLastName
            },
            level: course.Level.Value.toString(),
            durationWeeks: course.WeeksDuration.Value,
            durationMinutes: course.MinutesDuration.Value,
            tags: course.Tags.map( tag => tag.Value ),
            date: course.Date.Value,
            lessons: []
        }
        for ( const section of course.Sections )
        {
            responseCourse.lessons.push( {
                id: section.Id.Value,
                title: section.Name.Value,
                content: section.Description.Value,
                video: section.Video.Value
            } )
        }

        return Result.success<GetCourseServiceResponseDto>( responseCourse, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}