import { Result } from "src/common/Domain/result-handler/Result"
import { Model } from "mongoose"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { OdmCourseEntity } from "../entities/odm-entities/odm-course.entity"
import { CourseCreated } from "src/course/domain/events/course-created-event"
import { CourseQueryRepository } from "../repositories/course-query-repository.interface"
import { CategoryQueryRepository } from "src/categories/infraesctructure/repositories/category-query-repository.interface"
import { TrainerQueryRepository } from "src/trainer/infraestructure/repositories/trainer-query-repository.interface"




export class CourseQuerySyncronizer implements Querysynchronizer<CourseCreated>{

    private readonly courseRepository: CourseQueryRepository
    private readonly trainerRepository: TrainerQueryRepository
    private readonly categoryRepository: CategoryQueryRepository
    private readonly courseModel: Model<OdmCourseEntity>
    constructor ( courseRepository: CourseQueryRepository, courseModel: Model<OdmCourseEntity> ,categoryRepository: CategoryQueryRepository, trainerRepository: TrainerQueryRepository){
        this.courseRepository = courseRepository
        this.categoryRepository = categoryRepository
        this.trainerRepository = trainerRepository
        this.courseModel = courseModel
    }

    async execute ( event: CourseCreated ): Promise<Result<string>>
    {
        const courseTrainer = await this.trainerRepository.findTrainerById(  event.trainerId  )
        if ( !courseTrainer.isSuccess() ){
            return Result.fail<string>( courseTrainer.Error, courseTrainer.StatusCode, courseTrainer.Message )
        }
        const trainer = courseTrainer.Value
        const blogCategory = await this.categoryRepository.findCategoryById(  event.categoryId )
        if ( !blogCategory.isSuccess() ){
            return Result.fail<string>( blogCategory.Error, blogCategory.StatusCode, blogCategory.Message )
        }
        const category = blogCategory.Value
        const coursePersistence = new this.courseModel({
            id: event.id,
            name: event.name,
            description: event.description,
            level: event.level,
            weeks_duration: event.weeksDuration,
            minutes_per_section: event.minutesDuration,
            date: event.date,
            category: category,
            trainer: trainer,
            image: event.image,
            tags: event.tags.map( tag => tag ),
            sections: event.sections.map( section => ( { id: section.id, name: section.name, duration: section.duration, description: section.description, video: section.video } ) )
        })
        const errors = coursePersistence.validateSync()
        if ( errors ){
            return Result.fail<string>( errors, 400, errors.name )
        }
        try{
            await this.courseRepository.saveCourse(coursePersistence)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}