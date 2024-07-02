import { AggregateRoot } from "src/common/Domain/aggregate-root/aggregate-root";
import { CourseSubscriptionId } from "../value-objects/course-subscription-id";
import { CourseProgressionDate } from "../value-objects/course-progression-date";
import { CourseCompleted } from "../value-objects/course-completed";
import { SectionProgress } from "./progress-section/section-progress";
import { CourseId } from "src/course/domain/value-objects/course-id";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SectionProgressId } from "./progress-section/value-objects/section-progress-id";
import { SectionProgressNotExistsException } from "../exceptions/section-progress-not-exists-exception";
import { InvalidCourseSubscriptionException } from "../exceptions/invalid-course-subscription-exception";
import { CourseSubscriptionCreated } from "../events/course-subscription-created-event";
import { DomainEvent } from "src/common/Domain/domain-event/domain-event";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";
import { SectionCompleted } from "./progress-section/value-objects/section-completed";
import { SectionVideoProgress } from "./progress-section/value-objects/section-video-progress";

export class CourseSubscription extends AggregateRoot<CourseSubscriptionId>
{
    private lastProgression:CourseProgressionDate;
    private isCompleted:CourseCompleted;
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

    get IsCompleted(): CourseCompleted
    {
        return CourseCompleted.create(this.isCompleted.Value);
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

    public getSectionById(sectionId:SectionProgressId):SectionProgress
    {
        for (let section of this.sectionProgress)
        {
            if (section.Id.equals(sectionId))
            {
                return section;
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

    protected constructor( id:CourseSubscriptionId, lastProgression:CourseProgressionDate, isCompleted:CourseCompleted, sectionProgress:SectionProgress[], courseId:CourseId, userId:UserId )
    {
        const subscriptionCreated: CourseSubscriptionCreated = CourseSubscriptionCreated.create (
            id.Value, lastProgression.Value, isCompleted.Value,
            sectionProgress.map( progress => { return {   
                    id: progress.Id.Value,
                    isCompleted: progress.IsCompleted.Value,
                    videoProgress: progress.VideoProgress.Value,
                    sectionId: progress.SectionId.Value
                }}),
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
                this.isCompleted = CourseCompleted.create(subscriptionCreated.isCompleted);
                this.lastProgression = CourseProgressionDate.create(subscriptionCreated.lastProgression);
                this.sectionProgress = subscriptionCreated.sections.map( sectionProgress => SectionProgress.create( SectionProgressId.create(sectionProgress.id), SectionId.create(sectionProgress.sectionId), SectionCompleted.create(sectionProgress.isCompleted), SectionVideoProgress.create(sectionProgress.videoProgress) ) );
        }
    }

    static create ( id:CourseSubscriptionId, lastProgression:CourseProgressionDate, isCompleted:CourseCompleted, sectionProgress:SectionProgress[], courseId:CourseId, userId:UserId ):CourseSubscription
    {
        return new CourseSubscription( id, lastProgression, isCompleted, sectionProgress, courseId, userId );
    }
}