import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { GetCourseServiceEntryDto } from "../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetCourseServiceResponseDto } from "../dto/responses/get-course-service-response.dto"
import { CourseQueryRepository } from "../../repositories/course-query-repository.interface"
import { ImageGetter } from "src/common/Application/image-getter/image-getter.inteface"
import { FileTransformer } from "src/common/Application/file-transformer/file-transformer.interface"




export class GetCourseService implements IApplicationService<GetCourseServiceEntryDto, GetCourseServiceResponseDto>
{

    private readonly courseRepository: CourseQueryRepository
    private readonly imageGeter: ImageGetter
    private readonly imageTransformer: FileTransformer<Buffer, string>


    constructor ( courseRepository: CourseQueryRepository, imageGeter: ImageGetter, imageTransformer: FileTransformer<Buffer, string> )
    {

        this.courseRepository = courseRepository
        this.imageGeter = imageGeter
        this.imageTransformer = imageTransformer

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
        const imageResult = await this.imageGeter.getFile( course.image.split( '/' ).pop() )
        if ( !imageResult.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( imageResult.Error, imageResult.StatusCode, imageResult.Message )
        }

        const image = await this.imageTransformer.transformFile(imageResult.Value)
        if ( !image.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( image.Error, image.StatusCode, image.Message )
        }

        const finalImage = 'data:image/png;base64,' + image.Value

        let responseCourse: GetCourseServiceResponseDto = {
            id: course.id,
            title: course.name,
            description: course.description,
            category: course.category.categoryName,
            image: finalImage,
            trainer: {
                id: course.trainer.id,
                name: course.trainer.first_name + ' ' + course.trainer.first_last_name + ' ' + course.trainer.second_last_name
            },
            level: course.level,
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