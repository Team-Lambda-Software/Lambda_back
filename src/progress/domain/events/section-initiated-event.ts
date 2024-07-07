import { DomainEvent } from "src/common/Domain/domain-event/domain-event";

export class SectionInitiated extends DomainEvent
{
    protected constructor (
        public userId: string,
        public sectionId: string,
        public courseId: string
    )
    {
        super();
    }

    static create (userId:string, sectionId:string, courseId:string):SectionInitiated
    {
        return new SectionInitiated(userId,sectionId,courseId);
    }
}