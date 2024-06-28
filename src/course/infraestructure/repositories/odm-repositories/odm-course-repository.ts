import { Model } from "mongoose"
import { OdmCourseEntity } from "../../entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "../../entities/odm-entities/odm-section-comment.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { CourseQueryRepository } from "../course-query-repository.interface"




export class OdmCourseRepository implements CourseQueryRepository{

    private readonly courseModel: Model<OdmCourseEntity>
    private readonly sectionCommentModel: Model<OdmSectionCommentEntity>
    constructor ( courseModel: Model<OdmCourseEntity>, sectionCommentModel: Model<OdmSectionCommentEntity>)
    {
        this.courseModel = courseModel
        this.sectionCommentModel = sectionCommentModel

    }
    async findCourseTags (): Promise<Result<string[]>>
    {
        try{
            const tags = await this.courseModel.distinct( "tags" )
            return Result.success<string[]>( tags, 200 )
        } catch (error){
            return Result.fail<string[]>( error, 500, error.message)
        }
    }
    async findCourseCountByTrainer ( trainerId: string ): Promise<Result<number>>
    {
        try{
            const count = await this.courseModel.countDocuments( { 'trainer.id': trainerId } )
            return Result.success<number>( count, 200 )
        }catch (error){
            return Result.fail<number>( error, 500, error.message )
        }
    }
    async findCourseCountByCategory ( categoryId: string ): Promise<Result<number>>
    {
        try{
            const count = await this.courseModel.countDocuments( { 'category.id': categoryId } )
            return Result.success<number>( count, 200 )
        }catch (error){
            return Result.fail<number>( error, 500, error.message )
        }
    }

    async saveCourse ( course: OdmCourseEntity ): Promise<void>{
        
        await this.courseModel.create( course )
    }

    async addSectionToCourse ( courseId: string, section: {id: string, name: string, duration: number, description: string, video: string;} ): Promise<void>
    {
       
        await this.courseModel.updateOne( { id: courseId }, { $push: { sections: section } } )
    }

    async addCommentToSection ( comment: OdmSectionCommentEntity ): Promise<void>
    {   
        await this.sectionCommentModel.create( comment )
    }

    async findCoursesByTagsAndName ( searchTags: string[], name: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>{
        try{
            const {page, perPage} = pagination
            const query = {};
            if (searchTags.length) {
                query["tags"] = { $in: searchTags };
            }
            if (name) {
                query["name"] = { $regex: name, $options: 'i' };
            }
            const courses = await this.courseModel.find( query ).skip(page).limit(perPage).sort( { date: -1, id: -1} )
            return Result.success<OdmCourseEntity[]>( courses, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity[]>( error, 500, error.message )
        }
    }

    async findCourseById ( courseId: string ): Promise<Result<OdmCourseEntity>>{
        try{
            const course = await this.courseModel.findOne( { id: courseId } )
            return Result.success<OdmCourseEntity>( course, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity>( error, 500, error.message )
        }
    }

    async findSectionComments ( sectionId: string, pagination: PaginationDto): Promise<Result<OdmSectionCommentEntity[]>>{
        try{
            const {page, perPage} = pagination
            const comments = await this.sectionCommentModel.find( { "section.id": sectionId } ).skip(page).limit(perPage).sort( { date: -1, id: -1} )
            return Result.success<OdmSectionCommentEntity[]>( comments, 200 )
        }catch (error){
            return Result.fail<OdmSectionCommentEntity[]>( error, 500, error.message )
        }
    }

    async findCoursesByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>{
        try{
            const {page, perPage} = pagination
            const query = {};
            if (categoryId) {
                query["category.id"] = categoryId;
            }
            const courses = await this.courseModel.find( query ).skip(page).limit(perPage).sort( { date: -1, id: -1 } )
            return Result.success<OdmCourseEntity[]>( courses, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity[]>( error, 500, error.message )
        }
    }	

    async findCoursesByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>{
        try{
            const {page, perPage} = pagination
            const query = {};
            if (trainerId) {
                query["trainer.id"] = trainerId;
            }
            const courses = await this.courseModel.find( query ).skip(page).limit(perPage).sort( { date: -1, id: -1 } )
            return Result.success<OdmCourseEntity[]>( courses, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity[]>( error, 500, error.message )
        }
    }

    async findSectionById ( sectionId: string ): Promise<Result<{id: string, name: string, duration: number, description: string, video: string}>>{
        try{
            const course = await this.courseModel.findOne( { 'sections.id': sectionId } )
            const section = course.sections.find( section => section.id === sectionId )
            return Result.success<{id: string, name: string, duration: number, description: string, video: string}>( section, 200 )
        }catch (error){
            return Result.fail<{id: string, name: string, duration: number, description: string, video: string}>( error, 500, error.message )
        }
    }

    async findCourseBySectionId ( sectionId: string ): Promise<Result<OdmCourseEntity>>{
        try{
            const course = await this.courseModel.findOne( { 'sections.id': sectionId } )
            
            return Result.success<OdmCourseEntity>( course, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity>( error, 500, error.message )
        }
    }
}