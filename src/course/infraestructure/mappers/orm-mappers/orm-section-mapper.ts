import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Section } from "src/course/domain/entities/section"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { SectionVideo } from "src/course/domain/entities/compose-fields/section-video"
import { SectionImage } from "src/course/domain/entities/compose-fields/section-image"




export class OrmSectionMapper implements IMapper<Section, OrmSection>{
    fromDomainToPersistence ( domain: Section ): Promise<OrmSection>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmSection ): Promise<Section>
    {
        let images: SectionImage[] = []
        if ( persistence.images )
        {
            persistence.images.forEach( image =>
            {
                if ( image.section_id === persistence.id)
                    images.push( SectionImage.create( image.id, image.url ) )
            } )
        }
        

        let videos: SectionVideo[] = []
        
        if ( persistence.videos )
        {
            persistence.videos.forEach( video =>
            {
                if ( video.section_id === persistence.id)
                    videos.push( SectionVideo.create( video.url, video.id ) )
            } )
        }
        
        const section: Section = Section.create( persistence.id, persistence.name, persistence.description, videos, images, persistence.text )
        return section
    }

}
