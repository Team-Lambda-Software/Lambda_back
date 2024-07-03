import { DomainEvent } from "src/common/Domain/domain-event/domain-event";

export class SectionCompleted extends DomainEvent
{
    protected constructor (
        public userId: string,
        public sectionId: string,
        public courseId: string
    )
    {
        super();
    }

    static create (userId:string, sectionId:string, courseId:string):SectionCompleted
    {
        return new SectionCompleted(userId,sectionId,courseId);
    }
}