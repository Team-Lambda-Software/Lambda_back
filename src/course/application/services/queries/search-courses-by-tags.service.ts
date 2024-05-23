import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Course } from "src/course/domain/course"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { SearchCourseByTagsServiceEntryDto } from "../../dto/param/search-course-by-tags-service-entry.dto"




export class SearchCourseByTagsApplicationService implements IApplicationService<SearchCourseByTagsServiceEntryDto, Course[]>
{

    private readonly courseRepository: ICourseRepository

    constructor ( courseRepository: ICourseRepository )
    {
        this.courseRepository = courseRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: SearchCourseByTagsServiceEntryDto ): Promise<Result<Course[]>>
    {
        let { page = 0, perPage = 10 } = data.pagination
        perPage = perPage + page
        return await this.courseRepository.findCoursesByTags( data.tags, { page, perPage } )
    }

    get name (): string
    {
        return this.constructor.name
    }



}