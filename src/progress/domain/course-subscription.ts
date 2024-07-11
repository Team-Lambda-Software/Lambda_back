import { AggregateRoot } from "src/common/Domain/aggregate-root/aggregate-root";
import { CourseSubscriptionId } from "./value-objects/course-subscription-id";
import { CourseProgressionDate } from "./value-objects/course-progression-date";
import { CourseCompletion } from "./value-objects/course-completed";
import { SectionProgress } from "./entities/progress-section/section-progress";
import { CourseId } from "src/course/domain/value-objects/course-id";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SectionProgressId } from "./entities/progress-section/value-objects/section-progress-id";
import { SectionProgressNotExistsException } from "./exceptions/section-progress-not-exists-exception";
import { InvalidCourseSubscriptionException } from "./exceptions/invalid-course-subscription-exception";
import { CourseSubscriptionCreated } from "./events/course-subscription-created-event";
import { DomainEvent } from "src/common/Domain/domain-event/domain-event";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";
import { SectionVideoProgress } from "./entities/progress-section/value-objects/section-video-progress";
import { SectionProgressAlreadyExistsException } from "./exceptions/section-progress-already-exists-exception";
import { SectionInitiated } from "./events/section-initiated-event";
import { CourseCompletionPercent } from "./value-objects/course-completion-percent";
import { CourseInitiated } from "./events/course-initiated-event";
import { SectionCompletionPercent } from "./entities/progress-section/value-objects/section-completion-percent";
import { SectionCompletion } from "./entities/progress-section/value-objects/section-completed";
import { SectionCompleted } from "./events/section-completed-event";
import { UserHasProgressed } from "./events/user-has-progressed-event";
import { CourseCompleted } from "./events/course-completed-event";

export class CourseSubscription extends AggregateRoot<CourseSubscriptionId>
{
    private lastProgression:CourseProgressionDate;
    private isCompleted:CourseCompletion;
    private sectionProgress:SectionProgress[];
    private courseId:CourseId;
    private userId:UserId;

    get UserId(): UserId
    {
        return UserId.create(this.userId.Id);
    }

    get CourseId(): CourseId
    {
        return CourseId.create(this.courseId.Value);
    }

    get IsCompleted(): CourseCompletion
    {
        return CourseCompletion.create(this.isCompleted.Value);
    }

    get Sections(): SectionProgress[]
    {
        let sectionsCopy:SectionProgress[] = [];
        for (let section of this.sectionProgress)
        {
            sectionsCopy.push(SectionProgress.create(section.Id, section.SectionId, section.IsCompleted, section.VideoProgress));
        }
        return sectionsCopy;
    }

    get LastProgressionDate(): CourseProgressionDate
    {
        return CourseProgressionDate.create( this.lastProgression.Value );
    }

    public getSectionProgressIdBySectionId(sectionId:SectionId):SectionProgressId
    {
        for (let section of this.sectionProgress)
        {
            if (section.SectionId.equals(sectionId))
            {
                return section.Id;
            }
        }
        throw new SectionProgressNotExistsException();
    }

    public getVideoProgressBySectionId(sectionId:SectionId):SectionVideoProgress
    {
        for (let section of this.sectionProgress)
        {
            if (section.SectionId.equals(sectionId))
            {
                return section.VideoProgress;
            }
        }
        throw new SectionProgressNotExistsException();
    }

    public getCompletionBySectionId(sectionId:SectionId):SectionCompletion
    {
        for (let section of this.sectionProgress)
        {
            if (section.SectionId.equals(sectionId))
            {
                return section.IsCompleted;
            }
        }
        throw new SectionProgressNotExistsException();
    }

    protected ensureValidState(): void {
        if ( !this.courseId || !this.userId || !this.lastProgression || !this.isCompleted || !this.sectionProgress )
        {
            throw new InvalidCourseSubscriptionException();
        }
    }

    protected constructor( id:CourseSubscriptionId, lastProgression:CourseProgressionDate, isCompleted:CourseCompletion, sectionProgress:SectionProgress[], courseId:CourseId, userId:UserId )
    {
        const subscriptionCreated: CourseSubscriptionCreated = CourseSubscriptionCreated.create (
            id.Value, lastProgression.Value, isCompleted.Value,
            sectionProgress.map( progress => ({   
                    id: progress.Id.Value,
                    isCompleted: progress.IsCompleted.Value,
                    videoProgress: progress.VideoProgress.Value,
                    sectionId: progress.SectionId.Value
                })
            ),
            courseId.Value, userId.Id
        );
        super (id, subscriptionCreated);
    }

    protected applyEvent(event: DomainEvent): void 
    {
        switch (event.eventName) {
            case 'CourseSubscriptionCreated':
                const subscriptionCreated: CourseSubscriptionCreated = event as CourseSubscriptionCreated
                this.courseId = CourseId.create(subscriptionCreated.courseId);
                this.userId = UserId.create(subscriptionCreated.userId);
                this.isCompleted = CourseCompletion.create(subscriptionCreated.isCompleted);
                this.lastProgression = CourseProgressionDate.create(subscriptionCreated.lastProgression);
                this.sectionProgress = subscriptionCreated.sections.map( sectionProgress => SectionProgress.create( SectionProgressId.create(sectionProgress.id), SectionId.create(sectionProgress.sectionId), SectionCompletion.create(sectionProgress.isCompleted), SectionVideoProgress.create(sectionProgress.videoProgress) ) );
        }
    }

    static create ( id:CourseSubscriptionId, lastProgression:CourseProgressionDate, isCompleted:CourseCompletion, sectionProgress:SectionProgress[], courseId:CourseId, userId:UserId ):CourseSubscription
    {
        return new CourseSubscription( id, lastProgression, isCompleted, sectionProgress, courseId, userId );
    }

    //Copies the given section progress and associates it with the current course. If said section already exists, fails
    public saveSection (newSection: SectionProgress):void
    {
        this.createSectionProgress( newSection.Id, newSection.SectionId, newSection.IsCompleted, newSection.VideoProgress );
    }

    public createSectionProgress ( id:SectionProgressId, sectionId:SectionId, isCompleted:SectionCompletion, videoProgress:SectionVideoProgress ): SectionProgress
    {
        const sectionProgress: SectionProgress = SectionProgress.create(id, sectionId, isCompleted, videoProgress);
        for (let progress of this.sectionProgress)
        {
            if (progress.Id.equals(sectionProgress.Id))
            {
                throw new SectionProgressAlreadyExistsException();
            }
        }
        this.sectionProgress.push(sectionProgress);

        const sectionInitiated: SectionInitiated = SectionInitiated.create(this.userId.Id, sectionId.Value, this.CourseId.Value);
        this.onEvent(sectionInitiated);
        return sectionProgress;
    }

    public initiateCourseProgress()
    {
        const courseInitiated:CourseInitiated = CourseInitiated.create(this.userId.Id, this.courseId.Value);
        this.onEvent(courseInitiated);
    }

    //unused
    // public checkIfAlreadyInitiated (completion:CourseCompletionPercent):boolean
    // {
    //     if (completion.Value === 0) //Not initiated before, now initiating
    //     {
    //         const courseInitiated:CourseInitiated = CourseInitiated.create(this.userId.Id, this.courseId.Value);
    //         this.onEvent(courseInitiated);
    //         return false;
    //     }
    //     return true;
    // }

    public updateSectionProgress ( id:SectionProgressId, seconds?:SectionVideoProgress, isCompleted?:SectionCompletion)
    {
        let sectionProgress: SectionProgress = undefined;
        for (let section of this.sectionProgress)
        {
            if (section.Id.equals(id))
            {
                sectionProgress = section;
                break;
            }
        }
        if (sectionProgress === undefined)
        {
            throw new SectionProgressNotExistsException();
        }
        if (seconds != undefined)
        {
            sectionProgress.updateVideoProgress(seconds);
        }
        if (isCompleted != undefined) 
        {
            sectionProgress.updateCompletion(isCompleted);
            if (isCompleted.Value) 
            { 
                const sectionCompleted:SectionCompleted = SectionCompleted.create(this.userId.Id, sectionProgress.Id.Value, this.courseId.Value);
                this.onEvent(sectionCompleted);
            }
        }
    }

    public publishUserProgression ( sectionId: SectionProgressId, completion: SectionCompletionPercent )
    {
        let sectionProgress:SectionProgress = undefined;
        for (let section of this.sectionProgress)
        {
            if (section.Id.equals(sectionId))
            {
                sectionProgress = section;
                break;
            }
        }
        if (sectionProgress === undefined)
        {
            throw new SectionProgressNotExistsException();
        }
        const userHasProgressed:UserHasProgressed = UserHasProgressed.create(this.userId.Id, sectionProgress.SectionId.Value, this.courseId.Value, sectionProgress.VideoProgress.Value, completion.Value);
        this.onEvent(userHasProgressed);
    }

    public updateCourseCompletion (isCompleted:CourseCompletion)
    {
        this.isCompleted = isCompleted;
        if (isCompleted.Value)
        {
            const courseCompleted:CourseCompleted = CourseCompleted.create(this.UserId.Id, this.CourseId.Value);
            this.onEvent(courseCompleted);
        }
    }
}