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
import { TrainerQueryRepository } from "src/trainer/infraestructure/repositories/trainer-query-repository.interface"




export class BlogQuerySyncronizer implements Querysynchronizer<BlogCreated>{

    private readonly blogRepository: BlogQueryRepository
    private readonly trainerRepository: TrainerQueryRepository
    private readonly categoryRepository: CategoryQueryRepository
    private readonly blogModel: Model<OdmBlogEntity>
    constructor ( blogRepository: BlogQueryRepository, blogModel: Model<OdmBlogEntity> , categoryRepository: CategoryQueryRepository, trainerRepository: TrainerQueryRepository){
        this.blogRepository = blogRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository
        this.blogModel = blogModel
    }

    async execute ( event: BlogCreated ): Promise<Result<string>>
    {
        const blogTrainer = await this.trainerRepository.findTrainerById(  event.trainerId )
        if ( !blogTrainer.isSuccess() ){
            return Result.fail<string>( blogTrainer.Error, blogTrainer.StatusCode, blogTrainer.Message )
        }
        const trainer = blogTrainer.Value
        const blogCategory = await this.categoryRepository.findCategoryById(  event.categoryId )
        if ( !blogCategory.isSuccess() ){
            return Result.fail<string>( blogCategory.Error, blogCategory.StatusCode, blogCategory.Message )
        }
        const category = blogCategory.Value
        const blogPersistence = new this.blogModel({
            id: event.id,
            title: event.title,
            body: event.body,
            publication_date: event.publicationDate,
            category: category,
            trainer: trainer,
            images: event.images.map( image => ( { url: image } ) ),
            tags: event.tags.map( tag => tag )
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