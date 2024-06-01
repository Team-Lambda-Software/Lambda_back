import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Section } from "src/course/domain/entities/section"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { SectionVideo } from "src/course/domain/entities/compose-fields/section-video"
import { SectionImage } from "src/course/domain/entities/compose-fields/section-image"
import { OrmSectionImage } from "../../entities/orm-entities/orm-section-images"
import { OrmSectionVideo } from "../../entities/orm-entities/orm-section-videos"




export class OrmSectionMapper implements IMapper<Section, OrmSection>{
    async fromDomainToPersistence ( domain: Section ): Promise<OrmSection>
    {
        const section = OrmSection.create( domain.Id, domain.Name, domain.Description, domain.Duration, domain.Paragraph )
        if ( domain.Image )
        {
            section.image = OrmSectionImage.create( domain.Image.Id, domain.Image.Url )
        }
        if ( domain.Video )
        {
            section.video = OrmSectionVideo.create( domain.Video.Id, domain.Video.Url )
        }
        return section
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
