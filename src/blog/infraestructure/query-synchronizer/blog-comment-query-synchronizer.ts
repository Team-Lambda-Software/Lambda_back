import { BlogQueryRepository } from "../repositories/blog-query-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { Model } from "mongoose"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { OdmBlogCommentEntity } from "../entities/odm-entities/odm-blog-comment.entity"
import { BlogCommentCreated } from "src/blog/domain/events/blog-comment-created-event"
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
        const blog = await this.blogRepository.findBlogById(  event.blogId )
        if ( !blog.isSuccess() ){
            return Result.fail<string>( blog.Error, blog.StatusCode, blog.Message )
        }
        const resultBlog = blog.Value
        const user = await this.userRepository.findUserById( event.userId )
        if ( !user.isSuccess() ){
            return Result.fail<string>( user.Error, user.StatusCode, user.Message )
        }
        const resultUser = user.Value
        const odmBlogComment = new this.blogCommentModel({
            id: event.id,
            text: event.text,
            date: event.date,
            blog: resultBlog,
            user: resultUser
        })
        const errors = odmBlogComment.validateSync()
        if ( errors ){
            return Result.fail<string>( errors, 400, errors.name )
        }
        try{
            await this.blogRepository.createBlogComment(odmBlogComment)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}