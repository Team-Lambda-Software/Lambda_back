import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { CourseQueryRepository } from "../../repositories/course-query-repository.interface"
import { GetCourseCountServiceEntryDto } from "../dto/param/get-course-count-service-entry.dto"



export class GetCourseCountService implements IApplicationService<GetCourseCountServiceEntryDto, number> {
    
    private readonly courseRepository: CourseQueryRepository

    constructor ( courseRepository: CourseQueryRepository )
    {
        this.courseRepository = courseRepository
    }
    
    async execute ( data: GetCourseCountServiceEntryDto ): Promise<Result<number>>
    {
        try{
            if (data.trainer) {
                return await this.courseRepository.findCourseCountByTrainer( data.trainer )
            }
            if (data.category) {
                return await this.courseRepository.findCourseCountByCategory( data.category )
            }
        }catch (error){
            return Result.fail<number>( error, 500, error.message )
        }
    }
    get name (): string
    {
        return this.constructor.name
    }

}