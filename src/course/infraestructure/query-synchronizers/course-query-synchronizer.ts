import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Blog } from "src/blog/domain/blog"
import { Result } from "src/common/Domain/result-handler/Result"
import { BlogCreated } from "src/blog/domain/events/blog-created-event"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { Model } from "mongoose"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { OdmCourseEntity } from "../entities/odm-entities/odm-course.entity"
import { CourseCreated } from "src/course/domain/events/course-created-event"
import { Course } from "src/course/domain/course"
import { CourseQueryRepository } from "../repositories/course-query-repository.interface"




export class CourseQuerySyncronizer implements Querysynchronizer<CourseCreated>{

    private readonly courseRepository: CourseQueryRepository
    private readonly trainerModel: Model<OdmTrainerEntity>
    private readonly categoryModel: Model<OdmCategoryEntity>
    private readonly courseModel: Model<OdmCourseEntity>
    constructor ( courseRepository: CourseQueryRepository, courseModel: Model<OdmCourseEntity> ,categoryModel: Model<OdmCategoryEntity>, trainerModel: Model<OdmTrainerEntity>){
        this.courseRepository = courseRepository
        this.categoryModel = categoryModel
        this.trainerModel = trainerModel
        this.courseModel = courseModel
    }

    async execute ( event: CourseCreated ): Promise<Result<string>>
    {
        const course = Course.create( event.id, event.trainer, event.name, event.description, event.weeksDuration, event.minutesDuration, event.level, [] ,event.categoryId, event.image, event.tags, event.date)
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
        try{
            await this.courseRepository.saveCourse(coursePersistence)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}