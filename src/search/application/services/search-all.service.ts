import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { SearchAllServiceEntryDto } from "../dto/param/search-all-service-entry.dto"
import { SearchAllServiceResponseDto } from "../dto/responses/search-all-service-response.dto"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"




export class SearchAllApplicationService implements IApplicationService<SearchAllServiceEntryDto, SearchAllServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly blogRepository: IBlogRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository

    constructor ( courseRepository: ICourseRepository, blogRepository: IBlogRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository)
    {
        this.courseRepository = courseRepository
        this.blogRepository = blogRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository

    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchAllServiceEntryDto ): Promise<Result<SearchAllServiceResponseDto>>
    {
        const { page = 0, perPage = 10 } = data.pagination
        let resultCourses = await this.courseRepository.findCoursesByTagsAndName( data.tags, data.name, { page, perPage } )
        if ( !resultCourses.isSuccess() )
        {
            return Result.fail<SearchAllServiceResponseDto>( resultCourses.Error, resultCourses.StatusCode, resultCourses.Message )
        }
        let resultBlogs = await this.blogRepository.findBlogsByTagsAndTitle( data.tags,data.name, { page, perPage } )
        if ( !resultBlogs.isSuccess() )
        {
            return Result.fail<SearchAllServiceResponseDto>( resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message )
        }
        let responseSearch: SearchAllServiceResponseDto = { courses: [], blogs: [] }
        if ( resultCourses.Value.length > 0 )
        {
            for ( const course of resultCourses.Value )
            {
                const category = await this.categoryRepository.findCategoryById( course.CategoryId.Value )
                if ( !category.isSuccess() )
                {
                    return Result.fail<SearchAllServiceResponseDto>( category.Error, category.StatusCode, category.Message )
                }
                const trainer = await this.trainerRepository.findTrainerById( course.Trainer.Id )
                if ( !trainer.isSuccess() )
                {
                    return Result.fail<SearchAllServiceResponseDto>( trainer.Error, trainer.StatusCode, trainer.Message )
                }
                responseSearch.courses.push( {
                    id: course.Id,
                    title: course.Name,
                    image: course.Image,
                    date: course.Date,
                    category: category.Value.Name.Value,
                    trainer: trainer.Value.FirstName + ' ' + trainer.Value.FirstLastName + ' ' + trainer.Value.SecondLastName,
                } )
            }
        }
        if ( resultBlogs.Value.length > 0 )
        {
            for ( const blog of resultBlogs.Value )
            {
                const category = await this.categoryRepository.findCategoryById( blog.CategoryId.Value )
                if ( !category.isSuccess() )
                {
                    return Result.fail<SearchAllServiceResponseDto>( category.Error, category.StatusCode, category.Message )
                }
                const trainer = await this.trainerRepository.findTrainerById( blog.Trainer.Id )
                if ( !trainer.isSuccess() )
                {
                    return Result.fail<SearchAllServiceResponseDto>( trainer.Error, trainer.StatusCode, trainer.Message )
                }
                responseSearch.blogs.push( {
                    id: blog.Id.Value,
                    title: blog.Title.Value,
                    image: blog.Images[ 0 ].Value,
                    date: blog.PublicationDate.Value,
                    category: category.Value.Name.Value,
                    trainer: trainer.Value.FirstName + ' ' + trainer.Value.FirstLastName + ' ' + trainer.Value.SecondLastName,
                } )
            }
        }
        return Result.success<SearchAllServiceResponseDto>( responseSearch, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}