import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { BlogQueryRepository } from "../repositories/blog-query-repository.interface"
import { Blog } from "src/blog/domain/blog"
import { Result } from "src/common/Domain/result-handler/Result"
import { BlogCreated } from "src/blog/domain/events/blog-created-event"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { Model } from "mongoose"
import { OdmBlogEntity } from "../entities/odm-entities/odm-blog.entity"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"




export class BlogQuerySyncronizer implements Querysynchronizer<BlogCreated>{

    private readonly blogRepository: BlogQueryRepository
    private readonly trainerModel: Model<OdmTrainerEntity>
    private readonly categoryModel: Model<OdmCategoryEntity>
    private readonly blogModel: Model<OdmBlogEntity>
    constructor ( blogRepository: BlogQueryRepository, blogModel: Model<OdmBlogEntity> ,categoryModel: Model<OdmCategoryEntity>, trainerModel: Model<OdmTrainerEntity>){
        this.blogRepository = blogRepository
        this.categoryModel = categoryModel
        this.trainerModel = trainerModel
        this.blogModel = blogModel
    }

    async execute ( event: BlogCreated ): Promise<Result<string>>
    {
        const blog = Blog.create(event.id, event.title, event.body, event.images, event.publicationDate, event.trainer, event.categoryId, event.tags)
        const blogTrainer: OdmTrainerEntity = await this.trainerModel.findOne( { id: blog.Trainer.Id } )
        const blogCategory: OdmCategoryEntity = await this.categoryModel.findOne( { id: blog.CategoryId.Value } )
        const blogPersistence = new this.blogModel({
            id: blog.Id.Value,
            title: blog.Title.Value,
            body: blog.Body.Value,
            publication_date: blog.PublicationDate.Value,
            category: blogCategory,
            trainer: blogTrainer,
            images: blog.Images.map( image => ( { url: image.Value } ) ),
            tags: blog.Tags.map( tag => tag.Value )
        })
        try{
            await this.blogRepository.saveBlog(blogPersistence)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}