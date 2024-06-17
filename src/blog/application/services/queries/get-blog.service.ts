import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { GetBlogServiceEntryDto } from "../../dto/params/get-blog-service-entry.dto"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetBlogServiceResponseDto } from "../../dto/responses/get-blog-service-response.dto"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"




export class GetBlogApplicationService implements IApplicationService<GetBlogServiceEntryDto, GetBlogServiceResponseDto> 
{
    private readonly blogRepository: IBlogRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly trainerRepository: ITrainerRepository

    constructor ( blogRepository: IBlogRepository, categoryRepository: ICategoryRepository, trainerRepository: ITrainerRepository)
    {
        this.blogRepository = blogRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository
    }

    async execute ( data: GetBlogServiceEntryDto ): Promise<Result<GetBlogServiceResponseDto>>
    {
        const resultBlog = await this.blogRepository.findBlogById( data.blogId )
        if ( !resultBlog.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( resultBlog.Error, resultBlog.StatusCode, resultBlog.Message )
        }
        const blog = resultBlog.Value
        const category = await this.categoryRepository.findCategoryById( blog.CategoryId )
        if ( !category.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( category.Error, category.StatusCode, category.Message )
        }
        const trainer = await this.trainerRepository.findTrainerById( blog.Trainer.Id )
        if ( !trainer.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( trainer.Error, trainer.StatusCode, trainer.Message )
        }
        const response: GetBlogServiceResponseDto = {
            title: blog.Title.Value,
            description: blog.Body.Value,
            category: category.Value.Name,
            images: blog.Images.map( image => image.Value ),
            trainer: {
                id: trainer.Value.Id,
                name: trainer.Value.FirstName + ' ' + trainer.Value.FirstLastName + ' ' + trainer.Value.SecondLastName
            },
            tags: blog.Tags.map(tag => tag.Value),
            date: blog.PublicationDate.Value
        }

        return Result.success<GetBlogServiceResponseDto>( response, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}