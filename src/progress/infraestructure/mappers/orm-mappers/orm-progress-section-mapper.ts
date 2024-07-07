import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { SectionProgress } from "src/progress/domain/entities/progress-section/section-progress";
import { OrmProgressSection } from "../../entities/orm-entities/orm-progress-section";
import { SectionProgressId } from "src/progress/domain/entities/progress-section/value-objects/section-progress-id";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";
import { SectionCompletion } from "src/progress/domain/entities/progress-section/value-objects/section-completed";
import { SectionVideoProgress } from "src/progress/domain/entities/progress-section/value-objects/section-video-progress";

export class OrmProgressSectionMapper implements IMapper<SectionProgress, OrmProgressSection>
{
    async fromDomainToPersistence(domain: SectionProgress, userId?:string, completionPercent?:number): Promise<OrmProgressSection> 
    {
        const persistenceProgress = OrmProgressSection.create(domain.Id.Value, domain.SectionId.Value, domain.IsCompleted.Value, domain.VideoProgress.Value, 0);
        if (userId != undefined) { persistenceProgress.user_id = userId; }
        if (completionPercent != undefined) { persistenceProgress.completion_percent = completionPercent; }
        return persistenceProgress;
    }

    async fromPersistenceToDomain(persistence: OrmProgressSection): Promise<SectionProgress> 
    {
        const domainProgress = SectionProgress.create(
            SectionProgressId.create( persistence.progress_id ), 
            SectionId.create( persistence.section_id ), 
            SectionCompletion.create( persistence.completed ), 
            SectionVideoProgress.create( parseFloat(persistence.video_second.toString()) ),
        ); //! Postgres returns numeric as strings on runtime. Possible workaround?
        return domainProgress;
    }
}