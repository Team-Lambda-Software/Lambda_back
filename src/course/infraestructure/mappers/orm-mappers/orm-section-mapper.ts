import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { Section } from "src/course/domain/entities/section/section"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionName } from "src/course/domain/entities/section/value-objects/section-name"
import { SectionDescription } from "src/course/domain/entities/section/value-objects/section-description"
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration"
import { SectionVideo } from "src/course/domain/entities/section/value-objects/section-video"





export class OrmSectionMapper implements IMapper<Section, OrmSection>{
    async fromDomainToPersistence ( domain: Section ): Promise<OrmSection>
    {
        const section = OrmSection.create( domain.Id.Value, domain.Name.Value, domain.Description.Value, domain.Duration.Value, domain.Video.Value)
       
        return section
    }
    async fromPersistenceToDomain ( persistence: OrmSection ): Promise<Section>
    {
        
        const section: Section = Section.create( SectionId.create(persistence.id), SectionName.create(persistence.name), SectionDescription.create(persistence.description), SectionDuration.create(persistence.duration), SectionVideo.create(persistence.video_url))
        return section
    }

}
