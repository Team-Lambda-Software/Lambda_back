import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Blog } from "src/blog/domain/blog"
import { SearchAllByTagsServiceEntryDto } from "../dto/param/search-all-by-tags-service-entry.dto"
import { SearchAllServiceResponseDto } from "../dto/responses/search-all-service-response.dto"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"




export class SearchAllByTagsApplicationService implements IApplicationService<SearchAllByTagsServiceEntryDto, SearchAllServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly blogRepository: IBlogRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository

    constructor ( courseRepository: ICourseRepository, blogRepository: IBlogRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository )
    {
        this.courseRepository = courseRepository
        this.blogRepository = blogRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository

    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchAllByTagsServiceEntryDto ): Promise<Result<SearchAllServiceResponseDto>>
    {
        const { page = 0, perPage = 10 } = data.pagination
        let resultCourses = await this.courseRepository.findCoursesByTags( data.tags, { page, perPage } )
        if ( !resultCourses.isSuccess() )
        {
            if ( resultCourses.StatusCode != 404 )
                return Result.fail<SearchAllServiceResponseDto>( resultCourses.Error, resultCourses.StatusCode, resultCourses.Message )
            resultCourses = Result.success<Course[]>( [], 200 )
        }
        let resultBlogs = await this.blogRepository.findBlogsByTags( data.tags, { page, perPage } )
        if ( !resultBlogs.isSuccess() )
        {
            if ( resultBlogs.StatusCode != 404 )
                return Result.fail<SearchAllServiceResponseDto>( resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message )
            resultBlogs = Result.success<Blog[]>( [], 200 )
        }
        let responseSearch: SearchAllServiceResponseDto = { courses: [], blogs: [] }
        if ( resultCourses.Value.length > 0 )
        {
            for ( const course of resultCourses.Value )
            {
                const category = await this.categoryRepository.findCategoryById( course.CategoryId )
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
                    image: course.Image.Url,
                    date: course.Date,
                    category: category.Value.Name,
                    trainer: trainer.Value.FirstName + ' ' + trainer.Value.FirstLastName + ' ' + trainer.Value.SecondLastName,
                } )
            }
        }

        if ( resultBlogs.Value.length > 0 )
        {
            for ( const blog of resultBlogs.Value )
            {
                const category = await this.categoryRepository.findCategoryById( blog.CategoryId )
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
                    id: blog.Id,
                    title: blog.Title,
                    image: blog.Images[0].Url,
                    date: blog.PublicationDate,
                    category: category.Value.Name,
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