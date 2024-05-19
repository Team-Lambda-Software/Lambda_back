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
        
        let image: SectionImage = null
        if ( persistence.image )
        {
            
            image = SectionImage.create( persistence.image.id, persistence.image.url )
            
        }
        

        let video: SectionVideo = null
        
        if ( persistence.video )
        {
            video =  SectionVideo.create( persistence.video.url, persistence.video.id ) 
        }
        const section: Section = Section.create( persistence.id, persistence.name, persistence.description,persistence.duration ,video, image, persistence.text )
        return section
    }

}
