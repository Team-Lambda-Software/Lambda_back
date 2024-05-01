import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { GetCourseServiceEntryDto } from "../../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"




export class GetCourseApplicationService implements IApplicationService<GetCourseServiceEntryDto,Course>{
    
    private readonly courseRepository: ICourseRepository

    constructor ( courseRepository: ICourseRepository )
    {
        this.courseRepository = courseRepository
    }
    
    // TODO: Search the progress if exists one for that user
    execute ( data: GetCourseServiceEntryDto ): Promise<Result<Course>>
    {
        return this.courseRepository.findCourseById( data.courseId )
    }

    get name (): string
    {
        return this.constructor.name
    }



}