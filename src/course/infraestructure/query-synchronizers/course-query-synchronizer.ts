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
import { CategoryQueryRepository } from "src/categories/infraesctructure/repositories/category-query-repository.interface"




export class CourseQuerySyncronizer implements Querysynchronizer<CourseCreated>{

    private readonly courseRepository: CourseQueryRepository
    private readonly trainerModel: Model<OdmTrainerEntity>
    private readonly categoryRepository: CategoryQueryRepository
    private readonly courseModel: Model<OdmCourseEntity>
    constructor ( courseRepository: CourseQueryRepository, courseModel: Model<OdmCourseEntity> ,categoryRepository: CategoryQueryRepository, trainerModel: Model<OdmTrainerEntity>){
        this.courseRepository = courseRepository
        this.categoryRepository = categoryRepository
        this.trainerModel = trainerModel
        this.courseModel = courseModel
    }

    async execute ( event: CourseCreated ): Promise<Result<string>>
    {
        const course = Course.create( event.id, event.trainerId, event.name, event.description, event.weeksDuration, event.minutesDuration, event.level, [] ,event.categoryId, event.image, event.tags, event.date)
        const courseTrainer: OdmTrainerEntity = await this.trainerModel.findOne( { id: course.TrainerId.Value } )
        const blogCategory = await this.categoryRepository.findCategoryById(  course.CategoryId.Value )
        if ( !blogCategory.isSuccess() ){
            return Result.fail<string>( blogCategory.Error, blogCategory.StatusCode, blogCategory.Message )
        }
        const category = blogCategory.Value
        const coursePersistence = new this.courseModel({
            id: course.Id.Value,
            name: course.Name.Value,
            description: course.Description.Value,
            level: course.Level.Value,
            weeks_duration: course.WeeksDuration.Value,
            minutes_per_section: course.MinutesDuration.Value,
            date: course.Date.Value,
            category: category,
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