import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { GetCourseSectionServiceResponseDto } from "../../dto/responses/get-course-section-service-response.dto"
import { GetCourseSectionServiceEntryDto } from "../../dto/param/get-course-section-service-entry.dto"
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface"
import { ProgressVideo } from "src/progress/domain/entities/progress-video"




export class GetCourseSectionApplicationService implements IApplicationService<GetCourseSectionServiceEntryDto, GetCourseSectionServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly progressRepository: IProgressCourseRepository

    constructor ( courseRepository: ICourseRepository, progressRepository: IProgressCourseRepository)
    {
        this.courseRepository = courseRepository
        this.progressRepository = progressRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: GetCourseSectionServiceEntryDto ): Promise<Result<GetCourseSectionServiceResponseDto>>
    {
        const resultSection = await this.courseRepository.findSectionById( data.sectionId )
        if ( !resultSection.isSuccess() )
        {
            return Result.fail<GetCourseSectionServiceResponseDto>( resultSection.Error, resultSection.StatusCode, resultSection.Message )
        }

        const section = resultSection.Value
        const {offset = 0, limit = 10} = data.commentPagination
        const resultComments = await this.courseRepository.findSectionComments( section.Id, {offset, limit})
        if ( !resultComments.isSuccess() )
        {
            return Result.fail<GetCourseSectionServiceResponseDto>( resultComments.Error, resultComments.StatusCode, resultComments.Message )
        }
        
        const comments = resultComments.Value

        const videosProgress: ProgressVideo[] = []
        for ( const video of section.Videos )
        {
            const resultVideoProgress = await this.progressRepository.getVideoProgressById( data.userId, video.Id )
            if ( resultVideoProgress.isSuccess() )
            {
                videosProgress.push( resultVideoProgress.Value )
            }
        }

        return Result.success<GetCourseSectionServiceResponseDto>( {section, comments, videoProgress: videosProgress} , 200)
    }

    get name (): string
    {
        return this.constructor.name
    }



}