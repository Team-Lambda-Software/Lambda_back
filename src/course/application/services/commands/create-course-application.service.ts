import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { Course } from "src/course/domain/course"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { SectionImage } from '../../../domain/entities/compose-fields/section-image'
import { GetCourseServiceResponseDto } from "../../dto/responses/get-course-service-response.dto"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { CreateCourseServiceEntryDto } from "../../dto/param/create-course-service-entry.dto"



export class CreateCourseApplicationService implements IApplicationService<CreateCourseServiceEntryDto, GetCourseServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly trainerRepository: ITrainerRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly idGenerator: IdGenerator<string>

    constructor ( courseRepository: ICourseRepository, idGenerator: IdGenerator<string>, trainerRepository: ITrainerRepository, categoryRepository: ICategoryRepository)
    {
        this.idGenerator = idGenerator
        this.courseRepository = courseRepository
        this.trainerRepository = trainerRepository
        this.categoryRepository = categoryRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: CreateCourseServiceEntryDto ): Promise<Result<GetCourseServiceResponseDto>>
    {
        const trainer = await this.trainerRepository.findTrainerById( data.trainerId )
        if ( !trainer.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( trainer.Error, trainer.StatusCode, trainer.Message )
        }
        const course = Course.create( await this.idGenerator.generateId(), trainer.Value, data.name, data.description, data.weeksDuration, data.minutesDuration, data.level, [], data.categoryId, SectionImage.create( data.imageUrl, await this.idGenerator.generateId() ), data.tags, new Date() )
        const result = await this.courseRepository.saveCourseAggregate( course )
        if ( !result.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( result.Error, result.StatusCode, result.Message )
        }
        const category = await this.categoryRepository.findCategoryById( data.categoryId )
        if ( !category.isSuccess() )
        {
            return Result.fail<GetCourseServiceResponseDto>( category.Error, category.StatusCode, category.Message )
        }
        const responseCourse: GetCourseServiceResponseDto = {
            title: course.Name,
            description: course.Description,
            category: category.Value.Name,
            image: data.imageUrl,
            trainer: {
                id: trainer.Value.Id,
                name: trainer.Value.FirstName + " " + trainer.Value.FirstLastName + " " + trainer.Value.SecondLastName
            },
            level: course.Level.toString(),
            durationWeeks: course.WeeksDuration,
            durationMinutes: course.MinutesDuration,
            tags: course.Tags,
            date: course.Date,
            lessons: []
        }
        return Result.success<GetCourseServiceResponseDto>( responseCourse, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}