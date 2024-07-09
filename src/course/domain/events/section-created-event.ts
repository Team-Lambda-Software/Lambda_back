import { DomainEvent } from "src/common/Domain/domain-event/domain-event"


export class SectionCreated extends DomainEvent{
    protected constructor ( 
        public id: string, public name: string, public description: string, public duration: number, public video: string, public courseId: string, public newCourseMinutesDuration: number)
    {
        super()
    }

    static create ( id: string, name: string, description: string, duration: number, video: string, courseId: string, newCourseMinutesDuration: number): SectionCreated
    {
        return new SectionCreated( id, name, description, duration, video, courseId, newCourseMinutesDuration)
    }
}