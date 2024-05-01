import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Section } from "src/course/domain/entities/section"
import { SectionComment } from "src/course/domain/entities/section-comment"
import { OrmSectionComment } from "../../entities/orm-entities/orm-section-comment"



export class OrmSectionCommentMapper implements IMapper<SectionComment, OrmSectionComment>
{
    async fromDomainToPersistence ( domain: SectionComment ): Promise<OrmSectionComment>
    {
        return OrmSectionComment.create( domain.Id, domain.Text, domain.UserId, domain.SectionId, domain.Date)
    }
    async fromPersistenceToDomain ( persistence: OrmSectionComment ): Promise<SectionComment>
    {
        return SectionComment.create( persistence.id, persistence.user_id, persistence.text, persistence.date, persistence.section_id )
    }

}
