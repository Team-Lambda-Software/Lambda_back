import { Result } from "src/common/Domain/result-handler/Result";
import { Entity } from "src/common/Domain/domain-object/entity.interface";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";
import { SectionCompleted } from "./value-objects/section-completed";
import { SectionVideoProgress } from "./value-objects/section-video-progress";
import { SectionProgressId } from "./value-objects/section-progress-id";
import { InvalidSectionProgressException } from "./exceptions/invalid-section-progress-exception";

export class SectionProgress extends Entity<SectionProgressId>
{
    private sectionId:SectionId; //! This violates DDD, yet was preferred over redundancy or absorption
    private isCompleted:SectionCompleted;
    private videoProgress:SectionVideoProgress; //Moment of the video that the user was at when the progress was saved

    protected constructor (progressId:SectionProgressId, sectionId:SectionId, isCompleted:SectionCompleted, videoProgress:SectionVideoProgress)
    {
        super(progressId);
        this.sectionId = sectionId;
        this.isCompleted = isCompleted;
        this.videoProgress = videoProgress;
        this.ensureValidState();
    }

    get SectionId(): SectionId
    {
        return SectionId.create(this.sectionId.Value);
    }

    get IsCompleted() : SectionCompleted
    {
        return SectionCompleted.create(this.isCompleted.Value);
    }

    get VideoProgress() : SectionVideoProgress
    {
        return SectionVideoProgress.create(this.videoProgress.Value);
    }

    protected ensureValidState():void
    {
        if ( !this.Id || !this.SectionId || !this.VideoProgress || !this.isCompleted )
        {
            throw new InvalidSectionProgressException();
        }
    }

    static create (progressId:SectionProgressId, sectionId:SectionId, isCompleted:SectionCompleted = SectionCompleted.create(false), videoProgress:SectionVideoProgress = SectionVideoProgress.create(0)):SectionProgress
    {
        return new SectionProgress(progressId, sectionId, isCompleted, videoProgress);
    }

    public updateCompletion(isCompleted:SectionCompleted)
    {
        this.isCompleted = isCompleted;
    }

    public updateVideoProgress(videoProgress:SectionVideoProgress)
    {
        this.videoProgress = videoProgress;
    }
}