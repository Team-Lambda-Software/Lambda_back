import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { Course } from "src/course/domain/course"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { CreateCourseServiceEntryDto } from "../../dto/param/create-course-service-entry.dto"
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
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



export class CreateCourseApplicationService implements IApplicationService<CreateCourseServiceEntryDto, CreateCourseServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly trainerRepository: ITrainerRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly fileUploader: IFileUploader
    private readonly idGenerator: IdGenerator<string> 

    constructor ( courseRepository: ICourseRepository, idGenerator: IdGenerator<string>, trainerRepository: ITrainerRepository, categoryRepository: ICategoryRepository, fileUploader: IFileUploader)
    {
        this.idGenerator = idGenerator
        this.courseRepository = courseRepository
        this.trainerRepository = trainerRepository
        this.categoryRepository = categoryRepository
        this.fileUploader = fileUploader
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: CreateCourseServiceEntryDto ): Promise<Result<CreateCourseServiceResponseDto>>
    {
        const trainer = await this.trainerRepository.findTrainerById( data.trainerId )
        if ( !trainer.isSuccess() )
        {
            return Result.fail<CreateCourseServiceResponseDto>( trainer.Error, trainer.StatusCode, trainer.Message )
        }
        
        const imageId = await this.idGenerator.generateId()
        const imageUrl = await this.fileUploader.UploadFile( data.image, imageId )
        const course = Course.create( CourseId.create(await this.idGenerator.generateId()), trainer.Value, CourseName.create(data.name), CourseDescription.create(data.description), CourseWeeksDuration.create(data.weeksDuration), CourseMinutesDuration.create(data.minutesDuration), CourseLevel.create(data.level), [], CategoryId.create(data.categoryId), CourseImage.create(imageUrl), data.tags.map(tag => CourseTag.create(tag)), CourseDate.create(new Date()) )
        const result = await this.courseRepository.saveCourseAggregate( course )
        if ( !result.isSuccess() )
        {
            return Result.fail<CreateCourseServiceResponseDto>( result.Error, result.StatusCode, result.Message )
        }
        const category = await this.categoryRepository.findCategoryById( data.categoryId )
        if ( !category.isSuccess() )
        {
            return Result.fail<CreateCourseServiceResponseDto>( category.Error, category.StatusCode, category.Message )
        }
        const responseCourse: CreateCourseServiceResponseDto = {
            id: course.Id.Value,
            title: course.Name.Value,
            description: course.Description.Value,
            category: category.Value.Name.Value,
            image: imageUrl,
            trainer: {
                id: trainer.Value.Id,
                name: trainer.Value.FirstName + " " + trainer.Value.FirstLastName + " " + trainer.Value.SecondLastName
            },
            level: course.Level.toString(),
            durationWeeks: course.WeeksDuration.Value,
            durationMinutes: course.MinutesDuration.Value,
            tags: course.Tags.map( tag => tag.Value),
            date: course.Date.Value,
            lessons: []
        }
        return Result.success<CreateCourseServiceResponseDto>( responseCourse, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}