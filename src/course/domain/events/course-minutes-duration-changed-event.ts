import { DomainEvent } from "src/common/Domain/domain-event/domain-event"



export class CourseMinutesDurationChanged extends DomainEvent{
    protected constructor ( 
        public id: string, public newDuration: number)
    {
        super()
    }

    static create ( id: string, newDuration: number): CourseMinutesDurationChanged
    {
        return new CourseMinutesDurationChanged( id, newDuration)
    }
}