import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { Course } from "src/course/domain/course"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { CreateCourseServiceEntryDto } from "../../dto/param/create-course-service-entry.dto"
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"
import { CourseId } from "src/course/domain/value-objects/course-id"
import { CourseName } from "src/course/domain/value-objects/course-name"
import { CourseDescription } from "src/course/domain/value-objects/course-description"
import { CourseWeeksDuration } from "src/course/domain/value-objects/course-weeks-duration"
import { CourseMinutesDuration } from "src/course/domain/value-objects/course-minutes-duration"
import { CourseLevel } from "src/course/domain/value-objects/course-level"
import { CourseImage } from "src/course/domain/value-objects/course-image"
import { CourseTag } from "src/course/domain/value-objects/course-tag"
import { CourseDate } from "src/course/domain/value-objects/course-date"
import { CreateCourseServiceResponseDto } from "../../dto/responses/create-course-service-response.dto"
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface"
import { CourseTrainer } from "src/course/domain/value-objects/course-trainer"
import { CourseCategory } from "src/course/domain/value-objects/course-category"



export class CreateCourseApplicationService implements IApplicationService<CreateCourseServiceEntryDto, CreateCourseServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly fileUploader: IFileUploader
    private readonly idGenerator: IdGenerator<string>
    private readonly eventHandler: IEventHandler 
    private readonly trainerRepository: ITrainerRepository
    private readonly categoryRepository: ICategoryRepository

    constructor ( courseRepository: ICourseRepository, idGenerator: IdGenerator<string>, fileUploader: IFileUploader, eventHandler: IEventHandler, trainerRepository: ITrainerRepository, categoryRepository: ICategoryRepository)
    {
        this.idGenerator = idGenerator
        this.courseRepository = courseRepository
        this.fileUploader = fileUploader
        this.eventHandler = eventHandler
        this.trainerRepository = trainerRepository
        this.categoryRepository = categoryRepository
    }

    async execute ( data: CreateCourseServiceEntryDto ): Promise<Result<CreateCourseServiceResponseDto>>
    {
        const trainerResult = await this.trainerRepository.findTrainerById( data.trainerId )
        if ( !trainerResult.isSuccess() )
        {
            return Result.fail<CreateCourseServiceResponseDto>( trainerResult.Error, trainerResult.StatusCode, trainerResult.Message )
        }
        const categoryResult = await this.categoryRepository.findCategoryById( data.categoryId )
        if ( !categoryResult.isSuccess() )
        {
            return Result.fail<CreateCourseServiceResponseDto>( categoryResult.Error, categoryResult.StatusCode, categoryResult.Message )
        }

        const imageId = await this.idGenerator.generateId()
        const imageUrl = await this.fileUploader.UploadFile( data.image, imageId )
        const course = Course.create( CourseId.create(await this.idGenerator.generateId()), CourseTrainer.create(trainerResult.Value.Id), CourseName.create(data.name), CourseDescription.create(data.description), CourseWeeksDuration.create(data.weeksDuration), CourseMinutesDuration.create(0), CourseLevel.create(data.level), [], CourseCategory.create(categoryResult.Value.Id), CourseImage.create(imageUrl), data.tags.map(tag => CourseTag.create(tag)), CourseDate.create(new Date()) )
        const result = await this.courseRepository.saveCourseAggregate( course )
        if ( !result.isSuccess() )
        {
            return Result.fail<CreateCourseServiceResponseDto>( result.Error, result.StatusCode, result.Message )
        }

        const responseCourse: CreateCourseServiceResponseDto = {
            id: course.Id.Value,
            title: course.Name.Value,
            description: course.Description.Value,
            category: categoryResult.Value.Name.Value,
            image: imageUrl,
            trainer: {
                id: trainerResult.Value.Id.Value,
                name: trainerResult.Value.Name.FirstName + " " + trainerResult.Value.Name.FirstLastName + " " + trainerResult.Value.Name.SecondLastName
            },
            level: course.Level.Value.toString(),
            durationWeeks: course.WeeksDuration.Value,
            durationMinutes: course.MinutesDuration.Value,
            tags: course.Tags.map( tag => tag.Value),
            date: course.Date.Value,
            lessons: []
        }
        await this.eventHandler.publish( course.pullEvents())
        return Result.success<CreateCourseServiceResponseDto>( responseCourse, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}