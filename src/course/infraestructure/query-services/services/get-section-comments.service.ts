import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetSectionCommentsServiceEntryDto } from "../dto/param/get-section-comments-service-entry.dto"
import { GetSectionCommentsServiceResponseDto } from "../dto/responses/get-section-comments-service-response.dto"
import { CourseQueryRepository } from "../../repositories/course-query-repository.interface"




export class GetSectionCommentsService implements IApplicationService<GetSectionCommentsServiceEntryDto, GetSectionCommentsServiceResponseDto[]> 
{
    private readonly courseRepository: CourseQueryRepository

    constructor ( courseRepository: CourseQueryRepository)
    {
        this.courseRepository = courseRepository
    }

    async execute ( data: GetSectionCommentsServiceEntryDto ): Promise<Result<GetSectionCommentsServiceResponseDto[]>>
    {
        let { page = 1, perPage = 10 } = data.pagination
        page = page * perPage - perPage
        const comments = await this.courseRepository.findSectionComments( data.sectionId, {page, perPage} )
        if ( !comments.isSuccess() )
        {
            return Result.fail<GetSectionCommentsServiceResponseDto[]>( comments.Error, comments.StatusCode, comments.Message )
        }
        const response: GetSectionCommentsServiceResponseDto[] = []

        for ( const comment of comments.Value )
        {
            response.push( {
                id: comment.id,
                user: comment.user.name,
                body: comment.text,
                date: comment.date
            } )
        }

        return Result.success<GetSectionCommentsServiceResponseDto[]>( response, 200)

    }

    get name (): string
    {
        return this.constructor.name
    }

}