import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
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
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"




export class CreateBlogApplicationService implements IApplicationService<CreateBlogServiceEntryDto, string>
{

    private readonly blogRepository: IBlogRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: IFileUploader
    private readonly eventHandler: IEventHandler

    constructor ( blogRepository: IBlogRepository  ,idGenerator: IdGenerator<string>, fileUploader: IFileUploader, eventHandler: IEventHandler)
    {
        this.idGenerator = idGenerator
        this.blogRepository = blogRepository
        this.fileUploader = fileUploader
        this.eventHandler = eventHandler
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: CreateBlogServiceEntryDto ): Promise<Result<string>>
    {
        const images: BlogImage[] = []
        for ( const image of data.images ){
            const imageId = await this.idGenerator.generateId()
            const imageUrl = await this.fileUploader.UploadFile( image, imageId )
            images.push( BlogImage.create( imageUrl ) )
        }
        const blog = Blog.create( BlogId.create(await this.idGenerator.generateId()), BlogTitle.create(data.title), BlogBody.create(data.body), images, BlogPublicationDate.create(new Date()), TrainerId.create(data.trainerId), CategoryId.create(data.categoryId), data.tags.map(tag => BlogTag.create(tag)) )
        const result = await this.blogRepository.saveBlogAggregate( blog )
        if ( !result.isSuccess() )
        {
            return Result.fail<string>( result.Error, result.StatusCode, result.Message )
        }

        this.eventHandler.publish( blog.pullEvents())
        return Result.success<string>( "Blog guardado", 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}