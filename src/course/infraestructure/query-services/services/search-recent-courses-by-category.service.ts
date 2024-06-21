import { ICourseRepository } from 'src/course/domain/repositories/course-repository.interface'
import { IApplicationService } from 'src/common/Application/application-services/application-service.interface'
import { SearchCoursesByCategoryServiceEntryDto } from '../dto/param/search-courses-by-category-service-entry.dto'
import { Result } from 'src/common/Domain/result-handler/Result'
import { SearchCourseServiceResponseDto } from '../dto/responses/search-course-service-response.dto'
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface'
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface'


export class SearchRecentCoursesByCategoryService implements IApplicationService<SearchCoursesByCategoryServiceEntryDto, SearchCourseServiceResponseDto[]>{
    private readonly courseRepository: ICourseRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository

    constructor ( courseRepository: ICourseRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository)
    {
        this.courseRepository = courseRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository

    }
    async execute ( data: SearchCoursesByCategoryServiceEntryDto ): Promise<Result<SearchCourseServiceResponseDto[]>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const courses = await this.courseRepository.findCoursesByCategory( data.categoryId, data.pagination )
        if ( !courses.isSuccess() )
        {
            return Result.fail<SearchCourseServiceResponseDto[]>( courses.Error, courses.StatusCode, courses.Message )
        }
        const responseCourses: SearchCourseServiceResponseDto[] = []

        for (const course of courses.Value){
            const category = await this.categoryRepository.findCategoryById( course.CategoryId.Value )
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
                id: course.Id.Value,
                title: course.Name.Value,
                image: course.Image.Value,
                date: course.Date.Value,
                category: category.Value.Name.Value,
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