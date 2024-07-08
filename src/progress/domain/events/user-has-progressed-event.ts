import { DomainEvent } from "src/common/Domain/domain-event/domain-event";

export class UserHasProgressed extends DomainEvent
{
    protected constructor (
        public userId: string,
        public sectionId: string,
        public courseId:string,
        public seconds:number,
        public percentage:number
    )
    {
        super();
    }

    static create (userId:string, sectionId:string, courseId:string, seconds:number, percentage:number )
    {
        return new UserHasProgressed( userId, sectionId, courseId, seconds, percentage );
    }
}