import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { ProgressVideo } from "src/progress/domain/entities/progress-video";
import { OrmProgressVideo } from "../../entities/orm-entities/orm-progress-video";

export class OrmProgressVideoMapper implements IMapper<ProgressVideo, OrmProgressVideo> {
    async fromDomainToPersistence(domain: ProgressVideo): Promise<OrmProgressVideo> 
    {

        const persistenceProgress = OrmProgressVideo.create(domain.VideoId, domain.UserId, domain.IsCompleted, domain.PlaybackMilisec);
        return persistenceProgress;
    }

    async fromPersistenceToDomain(persistence: OrmProgressVideo): Promise<ProgressVideo> 
    {
        const domainProgress:ProgressVideo = ProgressVideo.create(persistence.user_id, persistence.video_id, persistence.playback_milisec, persistence.completed);
        return domainProgress;
    }
}