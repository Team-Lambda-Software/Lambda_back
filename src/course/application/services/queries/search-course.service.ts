import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { GetCourseServiceEntryDto } from "../../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { SearchCourseServiceEntryDto } from "../../dto/param/search-course-service-entry.dto"




export class SearchCourseApplicationService implements IApplicationService<SearchCourseServiceEntryDto,Course[]>{
    
    private readonly courseRepository: ICourseRepository

    constructor ( courseRepository: ICourseRepository )
    {
        this.courseRepository = courseRepository
    }
    
    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchCourseServiceEntryDto ): Promise<Result<Course[]>>
    {
        return await this.courseRepository.searchCoursesByName( data.name )
    }

    get name (): string
    {
        return this.constructor.name
    }



}