import { DomainEvent } from "src/common/Domain/domain-event/domain-event"


export class SectionCreated extends DomainEvent{
    protected constructor ( 
        public id: string, public name: string, public description: string, public duration: number, public video: string, public courseId: string)
    {
        super()
    }

    static create ( id: string, name: string, description: string, duration: number, video: string, courseId: string): SectionCreated
    {
        return new SectionCreated( id, name, description, duration, video, courseId)
    }
}