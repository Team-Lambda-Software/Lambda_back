import { Result } from "src/common/Domain/result-handler/Result"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { CourseQueryRepository } from "../repositories/course-query-repository.interface"
import { SectionCreated } from "src/course/domain/events/section-created-event"




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