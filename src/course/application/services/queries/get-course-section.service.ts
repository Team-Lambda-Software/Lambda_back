import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { GetCourseSectionServiceResponseDto } from "../../dto/responses/get-course-section-service-response.dto"
import { GetCourseSectionServiceEntryDto } from "../../dto/param/get-course-section-service-entry.dto"




export class GetCourseSectionApplicationService implements IApplicationService<GetCourseSectionServiceEntryDto, GetCourseSectionServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository

    constructor ( courseRepository: ICourseRepository )
    {
        this.courseRepository = courseRepository
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

        const resultComments = await this.courseRepository.findSectionComments( section.Id )
        if ( !resultComments.isSuccess() )
        {
            return Result.fail<GetCourseSectionServiceResponseDto>( resultComments.Error, resultComments.StatusCode, resultComments.Message )
        }
        
        const comments = resultComments.Value

        return Result.success<GetCourseSectionServiceResponseDto>( {section, comments} , 200)
    }

    get name (): string
    {
        return this.constructor.name
    }



}