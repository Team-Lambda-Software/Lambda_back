import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetBlogCommentsServiceEntryDto } from "../../dto/params/get-blog-comments-service-entry.dto"
import { GetBlogCommentsServiceResponseDto } from "../../dto/responses/get-blog-comments-service-response.dto"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"




export class GetBlogCommentsApplicationService implements IApplicationService<GetBlogCommentsServiceEntryDto, GetBlogCommentsServiceResponseDto[]> 
{
    private readonly blogRepository: IBlogRepository
    private readonly userRepository: IUserRepository

    constructor ( blogRepository: IBlogRepository, userRepository: IUserRepository)
    {
        this.blogRepository = blogRepository
        this.userRepository = userRepository
    }

    async execute ( data: GetBlogCommentsServiceEntryDto ): Promise<Result<GetBlogCommentsServiceResponseDto[]>>
    {
        const { page = 0, perPage = 10 } = data.pagination
        const comments = await this.blogRepository.findBlogComments( data.blogId, {page, perPage} )
        if ( !comments.isSuccess() )
        {
            return Result.fail<GetBlogCommentsServiceResponseDto[]>( comments.Error, comments.StatusCode, comments.Message )
        }
        const response: GetBlogCommentsServiceResponseDto[] = []

        for ( const comment of comments.Value )
        {
            const user = await this.userRepository.findUserById( comment.UserId )
            if ( !user.isSuccess() )
            {
                return Result.fail<GetBlogCommentsServiceResponseDto[]>( user.Error, user.StatusCode, user.Message )
            }
            response.push( {
                id: comment.Id,
                user: user.Value.FirstName + " " + user.Value.FirstLastName + " " + user.Value.SecondLastName,
                body: comment.Text,
                date: comment.Date
            } )
        }

        return Result.success<GetBlogCommentsServiceResponseDto[]>( response, 200)

    }

    get name (): string
    {
        return this.constructor.name
    }

}