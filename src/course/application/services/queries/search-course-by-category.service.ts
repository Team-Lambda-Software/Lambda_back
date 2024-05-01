import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { GetCourseServiceEntryDto } from "../../dto/param/get-course-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { SearchCourseServiceEntryDto } from "../../dto/param/search-course-service-entry.dto"
import { SearchCourseByCategoryServiceEntryDto } from "../../dto/param/search-course-by-category-service-entry.dto"




export class SearchCourseByCategoryApplicationService implements IApplicationService<SearchCourseByCategoryServiceEntryDto,Course[]>{
    
    private readonly courseRepository: ICourseRepository

    constructor ( courseRepository: ICourseRepository )
    {
        this.courseRepository = courseRepository
    }
    
    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchCourseByCategoryServiceEntryDto ): Promise<Result<Course[]>>
    {
        return await this.courseRepository.findCoursesByCategory( data.categoryId )
    }

    get name (): string
    {
        return this.constructor.name
    }



}