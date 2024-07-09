import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { AddSectionToCourseServiceEntryDto } from "../../dto/param/add-section-to-course-service-entry.dto"
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"
import { Section } from "src/course/domain/entities/section/section"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionName } from "src/course/domain/entities/section/value-objects/section-name"
import { SectionDescription } from "src/course/domain/entities/section/value-objects/section-description"
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration"
import { SectionVideo } from "src/course/domain/entities/section/value-objects/section-video"
import { AddSectionToCourseServiceResponseDto } from "../../dto/responses/add-section-to-course-service-response.dto"
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface"
import { IDurationFetcher } from "src/common/Application/duration-fetcher/duration-fetcher.interface"



export class AddSectionToCourseApplicationService implements IApplicationService<AddSectionToCourseServiceEntryDto, AddSectionToCourseServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: IFileUploader
    private readonly durationFetcher: IDurationFetcher<string>
    private readonly eventHandler: IEventHandler

    constructor ( courseRepository: ICourseRepository, idGenerator: IdGenerator<string>, fileUploader: IFileUploader, eventHandler: IEventHandler, durationFetcher: IDurationFetcher<string>)
    {
        this.idGenerator = idGenerator
        this.courseRepository = courseRepository
        this.fileUploader = fileUploader
        this.eventHandler = eventHandler
        this.durationFetcher = durationFetcher
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: AddSectionToCourseServiceEntryDto ): Promise<Result<AddSectionToCourseServiceResponseDto>>
    {
        let videoId = null
        let videoUrl: string = null
        
        if ( !data.file )
            return Result.fail<AddSectionToCourseServiceResponseDto>( new Error('File is required'), 400, 'File is required' )

        videoId = await this.idGenerator.generateId()
        videoUrl = await this.fileUploader.UploadFile( data.file, videoId )
        videoUrl = videoUrl + process.env.SAS_TOKEN
        const duration = Math.floor(await this.durationFetcher.getDuration( videoUrl ))
        const courseResult = await this.courseRepository.findCourseById( data.courseId )
        if ( !courseResult.isSuccess() )
        {
            return Result.fail<AddSectionToCourseServiceResponseDto>( courseResult.Error, courseResult.StatusCode, courseResult.Message )
        }

        const courseValue = courseResult.Value
        courseValue.pullEvents()
        let section: Section
        section = courseValue.createSection( SectionId.create(await this.idGenerator.generateId()), SectionName.create(data.name), SectionDescription.create(data.description), SectionDuration.create(duration), SectionVideo.create(videoUrl))
        const result = await this.courseRepository.addSectionToCourse( data.courseId, section )
        if ( !result.isSuccess() )
        {
            return Result.fail<AddSectionToCourseServiceResponseDto>( result.Error, result.StatusCode, result.Message )
        }
        const responseSection: AddSectionToCourseServiceResponseDto = {
            id: section.Id.Value,
            name: section.Name.Value,
            description: section.Description.Value,
            video: section.Video.Value,
            duration: section.Duration.Value
        }
        await this.eventHandler.publish( courseValue.pullEvents())
        return Result.success<AddSectionToCourseServiceResponseDto>( responseSection, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}