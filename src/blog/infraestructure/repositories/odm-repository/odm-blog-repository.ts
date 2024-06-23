import { Blog } from "src/blog/domain/blog"
import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Model } from "mongoose"
import { OdmBlogEntity } from "../../entities/odm-entities/odm-blog.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { OdmBlogCommentEntity } from "../../entities/odm-entities/odm-blog-comment.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { BlogQueryRepository } from "../blog-query-repository.interface"



export class OdmBlogRepository implements BlogQueryRepository{

    private readonly blogModel: Model<OdmBlogEntity>
    private readonly categoryModel: Model<OdmCategoryEntity>
    private readonly trainerModel: Model<OdmTrainerEntity>
    private readonly blogCommentModel: Model<OdmBlogCommentEntity>
    private readonly userModel: Model<OdmUserEntity>
    constructor ( blogModel: Model<OdmBlogEntity>, categoryModel: Model<OdmCategoryEntity>, trainerModel: Model<OdmTrainerEntity>, blogCommentModel: Model<OdmBlogCommentEntity>, userModel: Model<OdmUserEntity>)
    {
        this.blogModel = blogModel
        this.categoryModel = categoryModel
        this.trainerModel = trainerModel
        this.blogCommentModel = blogCommentModel
        this.userModel = userModel

    }

    async saveBlog ( blog: OdmBlogEntity ): Promise<void>
    {
        await this.blogModel.create( blog )    
    }

    async createBlogComment (blogComment: OdmBlogCommentEntity): Promise<void>
    {
        await this.blogCommentModel.create( blogComment )
    }

    async findBlogsByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>
    {
        try{
            const {page, perPage} = pagination
            const blogs = await this.blogModel.find( { "category.id": categoryId} ).skip(page).limit(perPage).sort( { publication_date: -1, id: -1 } )
            return Result.success<OdmBlogEntity[]>( blogs, 200 )
        }catch (error){
            return Result.fail<OdmBlogEntity[]>( error, 500, "Internal Server Error" )
        }
    }

    async findBlogsByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>{
        try{
            const {page, perPage} = pagination
            const blogs = await this.blogModel.find( { "trainer.id": trainerId } ).skip(page).limit(perPage).sort( { publication_date: -1, id: -1 } )
            return Result.success<OdmBlogEntity[]>( blogs, 200 )
        }catch (error){
            return Result.fail<OdmBlogEntity[]>( error, 500, "Internal Server Error" )
        }
    }

    async findBlogComments ( blogId: string, pagination: PaginationDto ): Promise<Result<OdmBlogCommentEntity[]>>{
        try{
            const {page, perPage} = pagination
            const comments = await this.blogCommentModel.find( { "blog.id": blogId } ).skip(page).limit(perPage).sort( { date: -1, id: -1 } )
            return Result.success<OdmBlogCommentEntity[]>( comments, 200 )
        }catch (error){
            return Result.fail<OdmBlogCommentEntity[]>( error, 500, "Internal Server Error" )
        }
    }

    async findBlogCommentCount ( blogId: string ): Promise<Result<number>>
    {
        try{
            const comments = await this.blogCommentModel.find( { "blog.id": blogId } )
            return Result.success<number>( comments.length, 200 )
        }catch (error){
            return Result.fail<number>( error, 500, "Internal Server Error" )
        }
    }

    async findBlogById ( id: string ): Promise<Result<OdmBlogEntity>>
    {
        try{
            const blog = await this.blogModel.findOne( { id: id } )
            return Result.success<OdmBlogEntity>( blog, 200 )
        }catch (error){
            return Result.fail<OdmBlogEntity>( error, 500, "Internal Server Error" )
        }

    }
    async findAllBlogs ( pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>
    {
        try{
            const {page, perPage} = pagination
            const blogs = await this.blogModel.find().skip(page).limit(perPage).sort( { publication_date: -1, id: -1 } )
            return Result.success<OdmBlogEntity[]>( blogs, 200 )
        } catch (error){
            return Result.fail<OdmBlogEntity[]>( error, 500, "Internal Server Error" )
        }
    }

    async findBlogsByTagsAndTitle ( searchTags: string[], title: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>{
        try{
            const {page, perPage} = pagination
            const query = {};
            if (searchTags.length) {
                query["tags"] = { $in: searchTags };
            }
            if (title) {
                query["title"] = { $regex: title, $options: 'i' };
            }
            const blogs = await this.blogModel.find( query ).skip(page).limit(perPage).sort( { publication_date: -1, id: -1 } )
            return Result.success<OdmBlogEntity[]>( blogs, 200 )
        }catch (error){
            return Result.fail<OdmBlogEntity[]>( error, 500, "Internal Server Error" )
        }
    }

}