import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Blog } from "src/blog/domain/blog"
import { Result } from "src/common/Domain/result-handler/Result"
import { BlogCreated } from "src/blog/domain/events/blog-created-event"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { Model } from "mongoose"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { BlogCommentCreated } from "src/blog/domain/events/blog-comment-created-event"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { SectionCommentCreated } from "src/course/domain/events/section-comment-created-event"
import { SectionComment } from "src/course/domain/entities/section-comment/section-comment"
import { CourseQueryRepository } from "../repositories/course-query-repository.interface"
import { OdmCourseEntity } from "../entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "../entities/odm-entities/odm-section-comment.entity"




export class SectionCommentQuerySyncronizer implements Querysynchronizer<SectionCommentCreated>{

    private readonly courseRepository: CourseQueryRepository
    private readonly userModel: Model<OdmUserEntity>
    private readonly courseModel: Model<OdmCourseEntity>
    private readonly sectionCommentModel: Model<OdmSectionCommentEntity>
    constructor ( courseRepository: CourseQueryRepository, sectionCommentModel: Model<OdmSectionCommentEntity> ,userModel: Model<OdmUserEntity>, courseModel: Model<OdmCourseEntity>){
        this.courseRepository = courseRepository
        this.userModel = userModel
        this.courseModel = courseModel
        this.sectionCommentModel = sectionCommentModel
    }

    async execute ( event: SectionCommentCreated ): Promise<Result<string>>
    {
        const comment = SectionComment.create(event.id, event.userId, event.text, event.date, event.sectionId)
        const user = await this.userModel.findOne( { id: comment.UserId.Id } )
        const course = await this.courseModel.findOne( { 'sections.id': comment.SectionId.Value } )
        const section = course.sections.find( section => section.id === comment.SectionId.Value )
        const odmComment = new this.sectionCommentModel({
            id: comment.Id.Value,
            text: comment.Text.Value,
            date: comment.Date.Value,
            section: section,
            user: user
        })
        try{
            await this.courseRepository.addCommentToSection(odmComment)
        }catch (error){
            return Result.fail<string>( error, 500, error.detail )
        }
        return Result.success<string>( 'success', 201 )
    }

}