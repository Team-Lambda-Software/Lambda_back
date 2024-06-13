import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { OrmProgressSection } from "../../entities/orm-entities/orm-progress-section";

export class OrmProgressSectionMapper implements IMapper<ProgressSection, OrmProgressSection>
{
    async fromDomainToPersistence(domain: ProgressSection, userId?:string): Promise<OrmProgressSection> 
    {
        const persistenceProgress = OrmProgressSection.create(domain.Id, domain.SectionId, domain.IsCompleted, domain.VideoSecond, domain.CompletionPercent);
        if (userId != undefined) { persistenceProgress.user_id = userId; }
        return persistenceProgress;
    }

    async fromPersistenceToDomain(persistence: OrmProgressSection): Promise<ProgressSection> 
    {
        const domainProgress = ProgressSection.create(persistence.progress_id, persistence.section_id, persistence.completed, persistence.video_second, persistence.completion_percent);
        return domainProgress; //? Is it alright to return without videos inside? Should service deal with this?
    }
}