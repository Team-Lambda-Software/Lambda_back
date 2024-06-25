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
import { OdmBlogCommentEntity } from "../entities/odm-entities/odm-blog-comment.entity"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { BlogCommentCreated } from "src/blog/domain/events/blog-comment-created-event"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { UserQueryRepository } from "src/user/infraestructure/repositories/user-query-repository.interface"




export class BlogCommentQuerySyncronizer implements Querysynchronizer<BlogCommentCreated>{

    private readonly blogRepository: BlogQueryRepository
    private readonly userRepository: UserQueryRepository
    private readonly blogCommentModel: Model<OdmBlogCommentEntity>
    constructor ( blogRepository: BlogQueryRepository, blogCommentModel: Model<OdmBlogCommentEntity>, userRepository: UserQueryRepository){
        this.blogRepository = blogRepository
        this.userRepository = userRepository
        this.blogCommentModel = blogCommentModel
    }

    async execute ( event: BlogCommentCreated ): Promise<Result<string>>
    {
        const blogComment = BlogComment.create(event.id, event.userId, event.text, event.date, event.blogId)
        const blog = await this.blogRepository.findBlogById(  blogComment.BlogId.Value )
        if ( !blog.isSuccess() ){
            return Result.fail<string>( blog.Error, blog.StatusCode, blog.Message )
        }
        const resultBlog = blog.Value
        const user = await this.userRepository.findUserById( blogComment.UserId.Id )
        if ( !user.isSuccess() ){
            return Result.fail<string>( user.Error, user.StatusCode, user.Message )
        }
        const resultUser = user.Value
        const odmBlogComment = new this.blogCommentModel({
            id: blogComment.Id.Value,
            text: blogComment.Text.Value,
            date: blogComment.Date.Value,
            blog: resultBlog,
            user: resultUser
        })
        try{
            await this.blogRepository.createBlogComment(odmBlogComment)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}