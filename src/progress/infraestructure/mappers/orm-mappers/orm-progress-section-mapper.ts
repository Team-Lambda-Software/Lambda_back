import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { OrmProgressSection } from "../../entities/orm-entities/orm-progress-section";

export class OrmProgressSectionMapper implements IMapper<ProgressSection, OrmProgressSection>
{
    async fromDomainToPersistence(domain: ProgressSection): Promise<OrmProgressSection> 
    {
        const persistenceProgress = OrmProgressSection.create(domain.SectionId, domain.UserId, domain.IsCompleted, domain.CompletionPercent);
        return persistenceProgress;
    }

    async fromPersistenceToDomain(persistence: OrmProgressSection): Promise<ProgressSection> 
    {
        const domainProgress = ProgressSection.create(persistence.user_id, persistence.section_id, persistence.completed, []);
        return domainProgress; //? Is it alright to return without videos inside? Should service deal with this?
    }
}