import { DomainEvent } from "src/common/Domain/domain-event/domain-event";

export class CourseInitiated extends DomainEvent
{
    protected constructor (
        public userId: string,
        public courseId: string
    )
    {
        super();
    }

    static create (userId:string, courseId:string):CourseInitiated
    {
        return new CourseInitiated(userId,courseId);
    }
}