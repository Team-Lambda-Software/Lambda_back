import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Section } from "src/course/domain/entities/section"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { SectionComment } from "src/course/domain/entities/section-comment"
import { Video } from "src/course/domain/entities/compose-fields/video"
import { Image } from "src/course/domain/entities/compose-fields/image"
import { Paragraph } from "src/course/domain/entities/compose-fields/paragraph"




export class OrmSectionMapper implements IMapper<Section, OrmSection>{
    fromDomainToPersistence ( domain: Section ): Promise<OrmSection>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmSection ): Promise<Section>
    {
        let images: Image[] = []
        if ( persistence.images )
        {
            persistence.images.forEach( image =>
            {
                if ( image.section_id === persistence.id)
                    images.push( Image.create( image.id, image.url ) )
            } )
        }
        

        let videos: Video[] = []
        
        if ( persistence.videos )
        {
            persistence.videos.forEach( video =>
            {
                if ( video.section_id === persistence.id)
                    videos.push( Video.create( video.id, video.url ) )
            } )
        }
    

        let comments: SectionComment[] = []
        if ( persistence.comments )
        {
            persistence.comments.forEach( comment =>
            {
                if ( comment.section_id === persistence.id)
                    comments.push( SectionComment.create( comment.id, comment.user_id, comment.text, comment.date ) )
            } )
        }
        
        const section: Section = Section.create( persistence.id, persistence.name, persistence.description, videos, images, Paragraph.create(persistence.text) ,comments )
        return section
    }

}
