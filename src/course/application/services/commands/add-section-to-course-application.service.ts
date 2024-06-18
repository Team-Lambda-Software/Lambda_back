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



export class AddSectionToCourseApplicationService implements IApplicationService<AddSectionToCourseServiceEntryDto, AddSectionToCourseServiceResponseDto>
{

    private readonly courseRepository: ICourseRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: IFileUploader

    constructor ( courseRepository: ICourseRepository, idGenerator: IdGenerator<string>, fileUploader: IFileUploader)
    {
        this.idGenerator = idGenerator
        this.courseRepository = courseRepository
        this.fileUploader = fileUploader
    }

    // TODO: Search the progress if exists one for that user
    async execute ( data: AddSectionToCourseServiceEntryDto ): Promise<Result<AddSectionToCourseServiceResponseDto>>
    {
        const course = await this.courseRepository.findCourseById( data.courseId )
        if ( !course.isSuccess() )
        {
            return Result.fail<AddSectionToCourseServiceResponseDto>( course.Error, course.StatusCode, course.Message )
        }
        console.log(course.Value)
        let videoId = null
        let videoUrl: string = null
        

        videoId = await this.idGenerator.generateId()
        videoUrl = await this.fileUploader.UploadFile( data.file, videoId )
        videoUrl = videoUrl + process.env.SAS_TOKEN
        
        
        let section: Section
        try{
            section = course.Value.createSection( SectionId.create(await this.idGenerator.generateId()), SectionName.create(data.name), SectionDescription.create(data.description), SectionDuration.create(data.duration), SectionVideo.create(videoUrl))
        }catch(e){
            return Result.fail<AddSectionToCourseServiceResponseDto>( e.message, 500 , e.message )
        }
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
        return Result.success<AddSectionToCourseServiceResponseDto>( responseSection, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}