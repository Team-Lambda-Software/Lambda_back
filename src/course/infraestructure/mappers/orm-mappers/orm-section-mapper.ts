import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Section } from "src/course/domain/entities/section"
import { OrmSection } from "../../entities/orm-entities/orm-section"





export class OrmSectionMapper implements IMapper<Section, OrmSection>{
    async fromDomainToPersistence ( domain: Section ): Promise<OrmSection>
    {
        const section = OrmSection.create( domain.Id, domain.Name, domain.Description, domain.Duration, domain.Video)
       
        return section
    }
    async fromPersistenceToDomain ( persistence: OrmSection ): Promise<Section>
    {
        
        const section: Section = Section.create( persistence.id, persistence.name, persistence.description,persistence.duration, persistence.video_url)
        return section
    }

}
