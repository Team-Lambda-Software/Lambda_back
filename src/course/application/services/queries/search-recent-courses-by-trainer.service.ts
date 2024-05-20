import { ICourseRepository } from 'src/course/domain/repositories/course-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { Result } from 'src/common/Application/result-handler/Result'
import { SearchCourseServiceResponseDto } from '../../dto/responses/search-course-service-response.dto'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'
import { SearchCoursesByTrainerServiceEntryDto } from '../../dto/param/search-courses-by-trainer-service-entry.dto'


export class SearchRecentCoursesByTrainerApplicationService implements IApplicationService<SearchCoursesByTrainerServiceEntryDto, SearchCourseServiceResponseDto[]>{
    private readonly courseRepository: ICourseRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository

    constructor ( courseRepository: ICourseRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository)
    {
        this.courseRepository = courseRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository

    }
    async execute ( data: SearchCoursesByTrainerServiceEntryDto ): Promise<Result<SearchCourseServiceResponseDto[]>>
    {
        const courses = await this.courseRepository.findCoursesByTrainer( data.trainerId, data.pagination )
        if ( !courses.isSuccess() )
        {
            return Result.fail<SearchCourseServiceResponseDto[]>( courses.Error, courses.StatusCode, courses.Message )
        }
        const responseCourses: SearchCourseServiceResponseDto[] = []

        for (const course of courses.Value){
            const category = await this.categoryRepository.findCategoryById( course.CategoryId )
            if ( !category.isSuccess() )
            {
                return Result.fail<SearchCourseServiceResponseDto[]>( category.Error, category.StatusCode, category.Message )
            }
            const trainer = await this.trainerRepository.findTrainerById( course.Trainer.Id )
            if ( !trainer.isSuccess() )
            {
                return Result.fail<SearchCourseServiceResponseDto[]>( trainer.Error, trainer.StatusCode, trainer.Message )
            }
            responseCourses.push({
                id: course.Id,
                title: course.Name,
                image: course.Image.Url,
                date: course.Date,
                category: category.Value.Name,
                trainer: trainer.Value.FirstName + ' ' + trainer.Value.FirstLastName + ' ' + trainer.Value.SecondLastName,
            })
        }

        return Result.success<SearchCourseServiceResponseDto[]>( responseCourses, 200 )
    }
    get name (): string
    {
        return this.constructor.name
    }
}