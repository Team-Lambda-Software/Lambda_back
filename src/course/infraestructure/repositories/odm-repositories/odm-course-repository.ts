import { Model } from "mongoose"
import { OdmCourseEntity } from "../../entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "../../entities/odm-entities/odm-section-comment.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section/section"
import { SectionComment } from "src/course/domain/entities/section-comment/section-comment"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { CourseQueryRepository } from "../course-query-repository.interface"




export class OdmCourseRepository implements CourseQueryRepository{

    private readonly courseModel: Model<OdmCourseEntity>
    private readonly sectionCommentModel: Model<OdmSectionCommentEntity>
    private readonly categoryModel: Model<OdmCategoryEntity>
    private readonly trainerModel: Model<OdmTrainerEntity>
    private readonly userModel: Model<OdmUserEntity>

    constructor ( courseModel: Model<OdmCourseEntity>, sectionCommentModel: Model<OdmSectionCommentEntity>, categoryModel: Model<OdmCategoryEntity>, trainerModel: Model<OdmTrainerEntity>, userModel: Model<OdmUserEntity>)
    {
        this.courseModel = courseModel
        this.sectionCommentModel = sectionCommentModel
        this.categoryModel = categoryModel
        this.trainerModel = trainerModel
        this.userModel = userModel

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
            return Result.fail<OdmCourseEntity[]>( error, 500, error.detail )
        }
    }

    async findCourseById ( courseId: string ): Promise<Result<OdmCourseEntity>>{
        try{
            const course = await this.courseModel.findOne( { id: courseId } )
            return Result.success<OdmCourseEntity>( course, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity>( error, 500, error.detail )
        }
    }

    async findSectionComments ( sectionId: string, pagination: PaginationDto): Promise<Result<OdmSectionCommentEntity[]>>{
        try{
            const {page, perPage} = pagination
            const comments = await this.sectionCommentModel.find( { "section.id": sectionId } ).skip(page).limit(perPage).sort( { date: -1, id: -1} )
            return Result.success<OdmSectionCommentEntity[]>( comments, 200 )
        }catch (error){
            return Result.fail<OdmSectionCommentEntity[]>( error, 500, error.detail )
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
            return Result.fail<OdmCourseEntity[]>( error, 500, error.detail )
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
            return Result.fail<OdmCourseEntity[]>( error, 500, error.detail )
        }
    }

    async findSectionById ( sectionId: string ): Promise<Result<{id: string, name: string, duration: number, description: string, video: string}>>{
        try{
            const course = await this.courseModel.findOne( { 'sections.id': sectionId } )
            const section = course.sections.find( section => section.id === sectionId )
            return Result.success<{id: string, name: string, duration: number, description: string, video: string}>( section, 200 )
        }catch (error){
            return Result.fail<{id: string, name: string, duration: number, description: string, video: string}>( error, 500, error.detail )
        }
    }

    async findCourseBySectionId ( sectionId: string ): Promise<Result<OdmCourseEntity>>{
        try{
            const course = await this.courseModel.findOne( { 'sections.id': sectionId } )
            console.log(course)
            return Result.success<OdmCourseEntity>( course, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity>( error, 500, error.detail )
        }
    }
}