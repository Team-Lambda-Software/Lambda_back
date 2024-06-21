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




export class OdmCourseRepository {

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

    async saveCourse ( course: Course ): Promise<void>{
        const courseTrainer: OdmTrainerEntity = await this.trainerModel.findOne( { id: course.Trainer.Id } )
        const courseCategory: OdmCategoryEntity = await this.categoryModel.findOne( { id: course.CategoryId.Value } )
        const coursePersistence = new this.courseModel({
            id: course.Id.Value,
            name: course.Name.Value,
            description: course.Description.Value,
            level: course.Level.Value,
            weeks_duration: course.WeeksDuration.Value,
            minutes_per_section: course.MinutesDuration.Value,
            date: course.Date.Value,
            category: courseCategory,
            trainer: courseTrainer,
            image: course.Image.Value,
            tags: course.Tags.map( tag => tag.Value ),
            sections: course.Sections.map( section => ( { id: section.Id.Value, name: section.Name.Value, duration: section.Duration.Value, description: section.Description.Value, video: section.Video.Value } ) )
        })
        await this.courseModel.create( coursePersistence )    
    }

    async addSectionToCourse ( courseId: string, section: Section ): Promise<void>
    {
        const odmSection = { id: section.Id.Value, name: section.Name.Value, duration: section.Duration.Value, description: section.Description.Value, video: section.Video.Value }
        await this.courseModel.updateOne( { id: courseId }, { $push: { sections: odmSection } } )
    }

    async addCommentToSection ( comment: SectionComment ): Promise<void>
    {
        const user = await this.userModel.findOne( { id: comment.UserId } )
        const course = await this.courseModel.findOne( { 'sections.id': comment.SectionId.Value } )
        const section = course.sections.find( section => section.id === comment.SectionId.Value )
        const odmComment = new this.sectionCommentModel({
            id: comment.Id.Value,
            text: comment.Text.Value,
            date: comment.Date.Value,
            section: section,
            user: user
        })
        await this.sectionCommentModel.create( odmComment )
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
            const courses = await this.courseModel.find( query ).skip(page).limit(perPage).sort( { date: -1 } )
            return Result.success<OdmCourseEntity[]>( courses, 200 )
        }catch (error){
            return Result.fail<OdmCourseEntity[]>( error, 500, error.detail )
        }
    }
}