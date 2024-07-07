import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { OrmProgressCourse } from "../../entities/orm-entities/orm-progress-course";
import { CourseSubscription } from "src/progress/domain/course-subscription";
import { CourseSubscriptionId } from "src/progress/domain/value-objects/course-subscription-id";
import { CourseProgressionDate } from "src/progress/domain/value-objects/course-progression-date";
import { CourseCompletion } from "src/progress/domain/value-objects/course-completed";
import { CourseId } from "src/course/domain/value-objects/course-id";
import { UserId } from "src/user/domain/value-objects/user-id";

export class OrmProgressCourseMapper implements IMapper<CourseSubscription, OrmProgressCourse>
{
    async fromDomainToPersistence(domain: CourseSubscription, completionPercent?:number): Promise<OrmProgressCourse> 
    {
        const persistenceProgress = OrmProgressCourse.create(domain.Id.Value, domain.CourseId.Value, domain.UserId.Id, domain.IsCompleted.Value, 0);
        if (completionPercent != undefined) { persistenceProgress.completion_percent = completionPercent; }
        return persistenceProgress;
    }

    async fromPersistenceToDomain(persistence: OrmProgressCourse): Promise<CourseSubscription> 
    {
        //TEST Is this a date?
            console.log("Date type...");
            console.log(typeof(persistence.last_seen_date));
        const domainProgress = CourseSubscription.create(
            CourseSubscriptionId.create( persistence.progress_id ),
            CourseProgressionDate.create( persistence.last_seen_date ),
            CourseCompletion.create( persistence.completed ),
            [],
            CourseId.create( persistence.course_id ),
            UserId.create( persistence.user_id )
        )
        return domainProgress; //? Is it alright to return without sections inside? Should service deal with this?
    }
}