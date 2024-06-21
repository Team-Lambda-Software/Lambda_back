import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"
import { GetSectionCommentsServiceEntryDto } from "../dto/param/get-section-comments-service-entry.dto"
import { GetSectionCommentsServiceResponseDto } from "../dto/responses/get-section-comments-service-response.dto"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"




export class GetSectionCommentsService implements IApplicationService<GetSectionCommentsServiceEntryDto, GetSectionCommentsServiceResponseDto[]> 
{
    private readonly courseRepository: ICourseRepository
    private readonly userRepository: IUserRepository

    constructor ( courseRepository: ICourseRepository, userRepository: IUserRepository)
    {
        this.courseRepository = courseRepository
        this.userRepository = userRepository
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
            const user = await this.userRepository.findUserById( comment.UserId )
            if ( !user.isSuccess() )
            {
                return Result.fail<GetSectionCommentsServiceResponseDto[]>( user.Error, user.StatusCode, user.Message )
            }
            response.push( {
                id: comment.Id.Value,
                user: user.Value.Name,
                body: comment.Text.Value,
                date: comment.Date.Value
            } )
        }

        return Result.success<GetSectionCommentsServiceResponseDto[]>( response, 200)

    }

    get name (): string
    {
        return this.constructor.name
    }

}