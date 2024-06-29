import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { SectionId } from "../entities/section/value-objects/section-id"
import { SectionName } from "../entities/section/value-objects/section-name"
import { SectionDescription } from "../entities/section/value-objects/section-description"
import { SectionDuration } from "../entities/section/value-objects/section-duration"
import { SectionVideo } from "../entities/section/value-objects/section-video"
import { CourseId } from "../value-objects/course-id"


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