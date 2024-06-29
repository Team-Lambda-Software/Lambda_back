import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Model } from "mongoose"
import { OdmBlogEntity } from "../../entities/odm-entities/odm-blog.entity"
import { OdmBlogCommentEntity } from "../../entities/odm-entities/odm-blog-comment.entity"
import { BlogQueryRepository } from "../blog-query-repository.interface"



export class OdmBlogRepository implements BlogQueryRepository{

    private readonly blogModel: Model<OdmBlogEntity>
    private readonly blogCommentModel: Model<OdmBlogCommentEntity>
    constructor ( blogModel: Model<OdmBlogEntity>,  blogCommentModel: Model<OdmBlogCommentEntity>)
    {
        this.blogModel = blogModel
        this.blogCommentModel = blogCommentModel

    }

    async findBlogTags (): Promise<Result<string[]>>
    {
        try{
            const tags = await this.blogModel.distinct( "tags" )
            return Result.success<string[]>( tags, 200 )
        } catch (error){
            return Result.fail<string[]>( error, 500, error.message)
        }
    }

    async findBlogCountByTrainer ( trainerId: string ): Promise<Result<number>>
    {
        try{
            const count = await this.blogModel.countDocuments( { 'trainer.id': trainerId } )
            return Result.success<number>( count, 200 )
        }catch (error){
            return Result.fail<number>( error, 500, error.message )
        }
    }
    async findBlogCountByCategory ( categoryId: string ): Promise<Result<number>>
    {
        try{
            const count = await this.blogModel.countDocuments( { 'category.id': categoryId } )
            return Result.success<number>( count, 200 )
        }catch (error){
            return Result.fail<number>( error, 500, error.message )
        }
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

    async findBlogsByPopularity ( pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>{
        try{
            const {page, perPage} = pagination
            const blogs = await this.blogModel.aggregate([
                {
                  '$lookup': {
                    'from': 'blogcomments', 
                    'localField': 'id', 
                    'foreignField': 'blog.id', 
                    'as': 'Comments'
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    'id': 1, 
                    'title': 1, 
                    'body': 1, 
                    'publication_date': 1, 
                    'category': 1, 
                    'trainer': 1, 
                    'images': 1, 
                    'tags': 1, 
                    'commentsCount': {
                      '$size': {
                        '$ifNull': [
                          '$Comments', []
                        ]
                      }
                    }
                  }
                }, {
                  '$sort': {
                    'commentsCount': -1, 
                    'id': -1
                  }
                }, {
                  '$project': {
                    'commentsCount': 0
                  }
                }, {
                  '$skip': page
                }, {
                  '$limit': perPage
                }
              ])
            return Result.success<OdmBlogEntity[]>( blogs, 200 )
        }catch (error){
            return Result.fail<OdmBlogEntity[]>( error, 500, "Internal Server Error" )
        }
    }

    async findBlogsByPopularityAndTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>{
        try{
            const {page, perPage} = pagination
            const blogs = await this.blogModel.aggregate([
                {
                  '$match': {
                    'trainer.id': trainerId
                  }
                }, {
                  '$lookup': {
                    'from': 'blogcomments', 
                    'localField': 'id', 
                    'foreignField': 'blog.id', 
                    'as': 'Comments'
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    'id': 1, 
                    'title': 1, 
                    'body': 1, 
                    'publication_date': 1, 
                    'category': 1, 
                    'trainer': 1, 
                    'images': 1, 
                    'tags': 1, 
                    'commentsCount': {
                      '$size': {
                        '$ifNull': [
                          '$Comments', []
                        ]
                      }
                    }
                  }
                }, {
                  '$sort': {
                    'commentsCount': -1, 
                    'id': -1
                  }
                }, {
                  '$project': {
                    'commentsCount': 0
                  }
                }, {
                  '$skip': page
                }, {
                  '$limit': perPage
                }
              ])
            return Result.success<OdmBlogEntity[]>( blogs, 200 )
        }catch (error){
            return Result.fail<OdmBlogEntity[]>( error, 500, "Internal Server Error" )
        }
    }

    async findBlogsByPopularityAndCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<OdmBlogEntity[]>>{
        try{
            const {page, perPage} = pagination
            const blogs = await this.blogModel.aggregate([
                {
                  '$match': {
                    'category.id': categoryId
                  }
                }, {
                  '$lookup': {
                    'from': 'blogcomments', 
                    'localField': 'id', 
                    'foreignField': 'blog.id', 
                    'as': 'Comments'
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    'id': 1, 
                    'title': 1, 
                    'body': 1, 
                    'publication_date': 1, 
                    'category': 1, 
                    'trainer': 1, 
                    'images': 1, 
                    'tags': 1, 
                    'commentsCount': {
                      '$size': {
                        '$ifNull': [
                          '$Comments', []
                        ]
                      }
                    }
                  }
                }, {
                  '$sort': {
                    'commentsCount': -1, 
                    'id': -1
                  }
                }, {
                  '$project': {
                    'commentsCount': 0
                  }
                }, {
                  '$skip': page
                }, {
                  '$limit': perPage
                }
              ])
            return Result.success<OdmBlogEntity[]>( blogs, 200 )
        }catch (error){
            return Result.fail<OdmBlogEntity[]>( error, 500, "Internal Server Error" )
        }
    }

}