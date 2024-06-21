import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { SectionId } from "../entities/section/value-objects/section-id"
import { SectionName } from "../entities/section/value-objects/section-name"
import { SectionDescription } from "../entities/section/value-objects/section-description"
import { SectionDuration } from "../entities/section/value-objects/section-duration"
import { SectionVideo } from "../entities/section/value-objects/section-video"
import { CourseId } from "../value-objects/course-id"


export class SectionCreated extends DomainEvent{
    protected constructor ( 
        public id: SectionId, public name: SectionName, public description: SectionDescription, public duration: SectionDuration, public video: SectionVideo, public courseId: CourseId)
    {
        super()
    }

    static create ( id: SectionId, name: SectionName, description: SectionDescription, duration: SectionDuration, video: SectionVideo, courseId: CourseId): SectionCreated
    {
        return new SectionCreated( id, name, description, duration, video, courseId)
    }
}