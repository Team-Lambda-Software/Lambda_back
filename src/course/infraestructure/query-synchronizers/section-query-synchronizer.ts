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
import { SectionCreated } from "src/course/domain/events/section-created-event"
import { Section } from "src/course/domain/entities/section/section"




export class SectionQuerySyncronizer implements Querysynchronizer<SectionCreated>{

    private readonly courseRepository: CourseQueryRepository
    constructor ( courseRepository: CourseQueryRepository){
        this.courseRepository = courseRepository
        
    }

    async execute ( event: SectionCreated ): Promise<Result<string>>
    {
        const odmSection = { id: event.id, name: event.name, duration: event.duration, description: event.description, video: event.video }
        
        try{
            await this.courseRepository.addSectionToCourse(event.courseId,odmSection)
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}