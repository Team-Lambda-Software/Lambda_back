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
import { UserQueryRepository } from "src/user/infraestructure/repositories/user-query-repository.interface"




export class SectionCommentQuerySyncronizer implements Querysynchronizer<SectionCommentCreated>{

    private readonly courseRepository: CourseQueryRepository
    private readonly userRepository: UserQueryRepository
    private readonly sectionCommentModel: Model<OdmSectionCommentEntity>
    constructor ( courseRepository: CourseQueryRepository, sectionCommentModel: Model<OdmSectionCommentEntity>, userRepository: UserQueryRepository){
        this.courseRepository = courseRepository
        this.userRepository = userRepository
        this.sectionCommentModel = sectionCommentModel
    }

    async execute ( event: SectionCommentCreated ): Promise<Result<string>>
    {
        const user = await this.userRepository.findUserById( event.userId )
        if ( !user.isSuccess() ){
            return Result.fail<string>( user.Error, user.StatusCode, user.Message )
        }
        const resultUser = user.Value
        const course = await this.courseRepository.findCourseBySectionId( event.sectionId )
        if ( !course.isSuccess() ){
            return Result.fail<string>( course.Error, course.StatusCode, course.Message )
        }
        const resultCourse = course.Value
        const section = resultCourse.sections.find( section => section.id === event.sectionId )
        const odmComment = new this.sectionCommentModel({
            id: event.id,
            text: event.text,
            date: event.date,
            section: section,
            user: resultUser
        })
        const errors = odmComment.validateSync()
        if ( errors ){
            return Result.fail<string>( errors, 400, errors.name )
        }
        try{
            await this.courseRepository.addCommentToSection(odmComment)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}