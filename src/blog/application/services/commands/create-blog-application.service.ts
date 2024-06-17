import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { GetBlogServiceResponseDto } from "../../dto/responses/get-blog-service-response.dto"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Blog } from "src/blog/domain/blog"
import { CreateBlogServiceEntryDto } from "../../dto/params/create-blog-service-entry.dto"
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"
import { BlogImage } from "src/blog/domain/value-objects/blog-image"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { BlogTitle } from "src/blog/domain/value-objects/blog-title"
import { BlogBody } from "src/blog/domain/value-objects/blog-body"
import { BlogPublicationDate } from "src/blog/domain/value-objects/blog-publication-date"
import { BlogTag } from "src/blog/domain/value-objects/blog-tag"
import { CategoryId } from "src/categories/domain/value-objects/category-id"




export class CreateBlogApplicationService implements IApplicationService<CreateBlogServiceEntryDto, GetBlogServiceResponseDto>
{

    private readonly blogRepository: IBlogRepository
    private readonly trainerRepository: ITrainerRepository
    private readonly categoryRepository: ICategoryRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: IFileUploader

    constructor ( blogRepository: IBlogRepository  ,idGenerator: IdGenerator<string>, trainerRepository: ITrainerRepository, categoryRepository: ICategoryRepository, fileUploader: IFileUploader)
    {
        this.idGenerator = idGenerator
        this.trainerRepository = trainerRepository
        this.categoryRepository = categoryRepository
        this.blogRepository = blogRepository
        this.fileUploader = fileUploader
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: CreateBlogServiceEntryDto ): Promise<Result<GetBlogServiceResponseDto>>
    {
        const trainer = await this.trainerRepository.findTrainerById( data.trainerId )
        if ( !trainer.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( trainer.Error, trainer.StatusCode, trainer.Message )
        }
        const images: BlogImage[] = []
        for ( const image of data.images ){
            const imageId = await this.idGenerator.generateId()
            const imageUrl = await this.fileUploader.UploadFile( image, imageId )
            images.push( BlogImage.create( imageUrl ) )
        }
        const blog = Blog.create( BlogId.create(await this.idGenerator.generateId()), BlogTitle.create(data.title), BlogBody.create(data.body), images, BlogPublicationDate.create(new Date()), trainer.Value, CategoryId.create(data.categoryId), data.tags.map(tag => BlogTag.create(tag)) )
        const result = await this.blogRepository.saveBlogAggregate( blog )
        if ( !result.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( result.Error, result.StatusCode, result.Message )
        }
        const category = await this.categoryRepository.findCategoryById( data.categoryId )
        if ( !category.isSuccess() )
        {
            return Result.fail<GetBlogServiceResponseDto>( category.Error, category.StatusCode, category.Message )
        }
        const responseBlog: GetBlogServiceResponseDto = {
            title: blog.Title.Value,
            description: blog.Body.Value,
            category: category.Value.Name.Value,
            images: blog.Images.map( image => image.Value ),
            trainer: {
                id: trainer.Value.Id,
                name: trainer.Value.FirstName + " " + trainer.Value.FirstLastName + " " + trainer.Value.SecondLastName
            },
            tags: blog.Tags.map(tag => tag.Value),
            date: blog.PublicationDate.Value
        }
        return Result.success<GetBlogServiceResponseDto>( responseBlog, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}