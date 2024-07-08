import { DomainEvent } from "src/common/Domain/domain-event/domain-event";

export class CourseCompleted extends DomainEvent
{
    protected constructor (
        public userId: string,
        public courseId: string
    )
    {
        super();
    }

    static create (userId:string, courseId:string):CourseCompleted
    {
        return new CourseCompleted(userId,courseId);
    }
}