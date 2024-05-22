import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { SectionImage } from '../../../domain/entities/compose-fields/section-image'
import { Section } from "src/course/domain/entities/section"
import { SectionVideo } from "src/course/domain/entities/compose-fields/section-video"
import { AddSectionToCourseServiceEntryDto } from "../../dto/param/add-section-to-course-service-entry.dto"
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"



export class AddSectionToCourseApplicationService implements IApplicationService<AddSectionToCourseServiceEntryDto, Section>
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
    async execute ( data: AddSectionToCourseServiceEntryDto ): Promise<Result<Section>>
    {
        const course = await this.courseRepository.findCourseById( data.courseId )
        if ( !course.isSuccess() )
        {
            return Result.fail<Section>( course.Error, course.StatusCode, course.Message )
        }
        let imageId = null
        let imageUrl = null
        let videoId = null
        let videoUrl = null
        
        if ( data.fileType === 'IMAGE'){
            imageId = await this.idGenerator.generateId()
            imageUrl = await this.fileUploader.UploadFile( data.file, imageId )
        } else {
            videoId = await this.idGenerator.generateId()
            videoUrl = await this.fileUploader.UploadFile( data.file, videoId )
        } 
        
        let section
        try{
            section = Section.create( await this.idGenerator.generateId(), data.name, data.description, data.duration, videoId ? SectionVideo.create( videoUrl, videoId ) : null, imageId ? SectionImage.create( imageUrl, imageId ) : null, data.paragraph ? data.paragraph : null )
        }catch(e){
            return Result.fail<Section>( e.message, 500 , e.message )
        }
        const result = await this.courseRepository.addSectionToCourse( data.courseId, section )
        if ( !result.isSuccess() )
        {
            return Result.fail<Section>( result.Error, result.StatusCode, result.Message )
        }
        return Result.success<Section>( section, 200 )
    }

    get name (): string
    {
        return this.constructor.name
    }



}