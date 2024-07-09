import { Result } from "src/common/Domain/result-handler/Result"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { CourseMinutesDurationChanged } from "src/course/domain/events/course-minutes-duration-changed-event"
import { CourseQueryRepository } from "../repositories/course-query-repository.interface"



export class CourseMinutesDurationChangedQuerySynchronizer implements Querysynchronizer<CourseMinutesDurationChanged>{
    
    private readonly courseRepository: CourseQueryRepository
    constructor ( courseRepository: CourseQueryRepository){
        this.courseRepository = courseRepository
        
    }
    async execute ( event: CourseMinutesDurationChanged ): Promise<Result<string>>
    {
        
        try{
            await this.courseRepository.changeCourseMinutesDuration( event.id, event.newDuration )
        }catch (error){
            return Result.fail<string>( error, 500, error.message )
        }
        return Result.success<string>( 'success', 201 )
    }

}