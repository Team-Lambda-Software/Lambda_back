import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { AddCommentToSectionServiceEntryDto } from "../../dto/param/add-comment-to-section-service-entry.dto"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { SectionComment } from "src/course/domain/entities/section-comment/section-comment"
import { Section } from "src/course/domain/entities/section/section"
import { SectionCommentId } from "src/course/domain/entities/section-comment/value-objects/section-comment-id"
import { SectionCommentText } from "src/course/domain/entities/section-comment/value-objects/section-comment-text"
import { SectionCommentDate } from "src/course/domain/entities/section-comment/value-objects/section-comment-date"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface"
import { UserId } from "src/user/domain/value-objects/user-id"




export class AddCommentToSectionApplicationService implements IApplicationService<AddCommentToSectionServiceEntryDto, SectionComment>
{

    private readonly courseRepository: ICourseRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly eventHandler: IEventHandler

    constructor ( courseRepository: ICourseRepository, idGenerator: IdGenerator<string>, eventHandler: IEventHandler)
    {
        this.idGenerator = idGenerator
        this.courseRepository = courseRepository
        this.eventHandler = eventHandler
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: AddCommentToSectionServiceEntryDto ): Promise<Result<SectionComment>>
    {
        const courseResult = await this.courseRepository.findCourseBySectionId( data.sectionId )
        if ( !courseResult.isSuccess() )
        {
            return Result.fail<SectionComment>( courseResult.Error, courseResult.StatusCode, courseResult.Message )
        }
        const sectionResult = await this.courseRepository.findSectionById( data.sectionId )
        if ( !sectionResult.isSuccess() )
        {
            return Result.fail<SectionComment>( sectionResult.Error, sectionResult.StatusCode, sectionResult.Message )
        }
        const section: Section = sectionResult.Value
        const course = courseResult.Value
        course.pullEvents()
        const comment = course.createComment( SectionCommentId.create(await this.idGenerator.generateId()), UserId.create(data.userId), SectionCommentText.create(data.comment), SectionCommentDate.create(new Date()), section.Id )
        const result = await this.courseRepository.addCommentToSection( comment )
        if ( !result.isSuccess() )
        {
            return Result.fail<SectionComment>( result.Error, result.StatusCode, result.Message )
        }
        await this.eventHandler.publish( course.pullEvents())
        return result
    }

    get name (): string
    {
        return this.constructor.name
    }



}