import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { GetBlogServiceResponseDto } from "../../dto/responses/get-blog-service-response.dto"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Blog } from "src/blog/domain/blog"
import { BlogImage } from "src/blog/domain/entities/blog-image"
import { CreateBlogServiceEntryDto } from "../../dto/params/create-blog-service-entry.dto"
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"




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
            if ( !['png','jpg','jpeg'].includes(image.originalname.split('.').pop())){
                return Result.fail<GetBlogServiceResponseDto>( new Error("Invalid image format"), 400, "Invalid image format" )
            }
            const imageId = await this.idGenerator.generateId()
            const imageUrl = await this.fileUploader.UploadFile( image, imageId )
            images.push( BlogImage.create( imageUrl, imageId ) )
        }
        const blog = Blog.create( await this.idGenerator.generateId(), data.title, data.body, images, new Date(), trainer.Value, data.categoryId, data.tags )
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
            title: blog.Title,
            description: blog.Body,
            category: category.Value.Name,
            images: blog.Images.map( image => image.Url ),
            trainer: {
                id: trainer.Value.Id,
                name: trainer.Value.FirstName + " " + trainer.Value.FirstLastName + " " + trainer.Value.SecondLastName
            },
            tags: blog.Tags,
            date: blog.PublicationDate
        }
        return Result.success<GetBlogServiceResponseDto>( responseBlog, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}