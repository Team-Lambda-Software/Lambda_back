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
import { CategoryQueryRepository } from "src/categories/infraesctructure/repositories/category-query-repository.interface"




export class BlogQuerySyncronizer implements Querysynchronizer<BlogCreated>{

    private readonly blogRepository: BlogQueryRepository
    private readonly trainerModel: Model<OdmTrainerEntity>
    private readonly categoryRepository: CategoryQueryRepository
    private readonly blogModel: Model<OdmBlogEntity>
    constructor ( blogRepository: BlogQueryRepository, blogModel: Model<OdmBlogEntity> , categoryRepository: CategoryQueryRepository, trainerModel: Model<OdmTrainerEntity>){
        this.blogRepository = blogRepository
        this.categoryRepository = categoryRepository
        this.trainerModel = trainerModel
        this.blogModel = blogModel
    }

    async execute ( event: BlogCreated ): Promise<Result<string>>
    {
        const blog = Blog.create(event.id, event.title, event.body, event.images, event.publicationDate, event.trainerId, event.categoryId, event.tags)
        const blogTrainer: OdmTrainerEntity = await this.trainerModel.findOne( { id: blog.TrainerId.Value } )
        const blogCategory = await this.categoryRepository.findCategoryById(  blog.CategoryId.Value )
        if ( !blogCategory.isSuccess() ){
            return Result.fail<string>( blogCategory.Error, blogCategory.StatusCode, blogCategory.Message )
        }
        const category = blogCategory.Value
        const blogPersistence = new this.blogModel({
            id: blog.Id.Value,
            title: blog.Title.Value,
            body: blog.Body.Value,
            publication_date: blog.PublicationDate.Value,
            category: category,
            trainer: blogTrainer,
            images: blog.Images.map( image => ( { url: image.Value } ) ),
            tags: blog.Tags.map( tag => tag.Value )
        })
        const errors = blogPersistence.validateSync()
        if ( errors ){
            return Result.fail<string>( errors, 400, errors.name )
        }
        try{
            await this.blogRepository.saveBlog(blogPersistence)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}