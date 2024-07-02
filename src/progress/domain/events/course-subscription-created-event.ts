import { DomainEvent } from "src/common/Domain/domain-event/domain-event";

export class CourseSubscriptionCreated extends DomainEvent
{
    protected constructor (
        public id:string,
        public lastProgression:Date,
        public isCompleted: boolean,
        public sections: {id:string, sectionId:string, isCompleted:boolean, videoProgress:number}[],
        public courseId:string,
        public userId:string
    )
    {
        super();
    }

    static create (id:string, lastProgression:Date, isCompleted:boolean, sections:{id:string, sectionId:string, isCompleted:boolean, videoProgress:number}[], courseId:string, userId:string):CourseSubscriptionCreated
    {
        return new CourseSubscriptionCreated(id,lastProgression,isCompleted,sections,courseId,userId);
    }
}