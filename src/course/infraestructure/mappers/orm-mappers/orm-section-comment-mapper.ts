import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmSectionComment } from "../../entities/orm-entities/orm-section-comment"
import { SectionComment } from "src/course/domain/entities/section-comment/section-comment"
import { SectionCommentId } from "src/course/domain/entities/section-comment/value-objects/section-comment-id"
import { SectionCommentText } from '../../../domain/entities/section-comment/value-objects/section-comment-text';
import { SectionCommentDate } from "src/course/domain/entities/section-comment/value-objects/section-comment-date"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { UserId } from "src/user/domain/value-objects/user-id"



export class OrmSectionCommentMapper implements IMapper<SectionComment, OrmSectionComment>
{
    async fromDomainToPersistence ( domain: SectionComment ): Promise<OrmSectionComment>
    {
        return OrmSectionComment.create( domain.Id.Value, domain.Text.Value, domain.UserId.Id, domain.SectionId.Value, domain.Date.Value)
    }
    async fromPersistenceToDomain ( persistence: OrmSectionComment ): Promise<SectionComment>
    {
        return SectionComment.create( SectionCommentId.create(persistence.id), UserId.create(persistence.user_id), SectionCommentText.create(persistence.text), SectionCommentDate.create(persistence.date), SectionId.create(persistence.section_id) )
    }

}
