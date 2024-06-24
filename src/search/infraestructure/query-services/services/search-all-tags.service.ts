import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { SearchAllTagsServiceEntryDto } from "../dto/param/search-all-tags-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface"
import { BlogQueryRepository } from "src/blog/infraestructure/repositories/blog-query-repository.interface"



export class SearchAllTagsService implements IApplicationService<SearchAllTagsServiceEntryDto, string[]>{
    
    private readonly courseRepository: CourseQueryRepository
    private readonly blogRepository: BlogQueryRepository

    constructor ( courseRepository: CourseQueryRepository, blogRepository: BlogQueryRepository)
    {
        this.courseRepository = courseRepository
        this.blogRepository = blogRepository
    }
    
    async execute ( data: SearchAllTagsServiceEntryDto ): Promise<Result<string[]>>
    {
        try{
            data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
            const courseTags = await this.courseRepository.findCourseTags()
            const blogTags = await this.blogRepository.findBlogTags()
            const tags = new Set(courseTags.Value.concat( blogTags.Value ))
            return Result.success<string[]>( Array.from(tags).slice(data.pagination.page, data.pagination.page + data.pagination.perPage), 200 )

        }catch (error){
            return Result.fail<string[]>( error, 500, error.message )
        }
    }
    get name (): string
    {
        return this.constructor.name
    }

}