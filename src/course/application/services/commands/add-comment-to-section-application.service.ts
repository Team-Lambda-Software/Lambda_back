import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { SectionComment } from "src/course/domain/entities/section-comment"
import { AddCommentToSectionServiceEntryDto } from "../../dto/param/add-comment-to-section-service-entry.dto"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"




export class AddCommentToSectionApplicationService implements IApplicationService<AddCommentToSectionServiceEntryDto, SectionComment>
{

    private readonly courseRepository: ICourseRepository
    private readonly idGenerator: IdGenerator<string>

    constructor ( courseRepository: ICourseRepository, idGenerator: IdGenerator<string> )
    {
        this.idGenerator = idGenerator
        this.courseRepository = courseRepository
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: AddCommentToSectionServiceEntryDto ): Promise<Result<SectionComment>>
    {
        const section = await this.courseRepository.findSectionById( data.sectionId )
        if ( !section.isSuccess() )
        {
            return Result.fail<SectionComment>( section.Error, section.StatusCode, section.Message )
        }
        const comment = SectionComment.create( await this.idGenerator.generateId(), data.userId, data.comment, new Date(), data.sectionId )
        const result = await this.courseRepository.addCommentToSection( comment )
        if ( !result.isSuccess() )
        {
            return Result.fail<SectionComment>( result.Error, result.StatusCode, result.Message )
        }
        return result
    }

    get name (): string
    {
        return this.constructor.name
    }



}