import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { SearchCourseByLevelsServiceEntryDto } from "../dto/param/search-course-by-levels-service-entry.dto"




export class SearchCourseByLevelsService implements IApplicationService<SearchCourseByLevelsServiceEntryDto, Course[]>
{

    private readonly courseRepository: ICourseRepository

    constructor ( courseRepository: ICourseRepository )
    {
        this.courseRepository = courseRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchCourseByLevelsServiceEntryDto ): Promise<Result<Course[]>>
    {
        let { page = 1, perPage = 10 } = data.pagination
        page = page * perPage - perPage
        return await this.courseRepository.findCoursesByLevels( data.levels, { page, perPage } )
    }

    get name (): string
    {
        return this.constructor.name
    }



}