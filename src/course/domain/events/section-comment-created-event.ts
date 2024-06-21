import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { SectionCommentId } from "../entities/section-comment/value-objects/section-comment-id"
import { SectionCommentText } from "../entities/section-comment/value-objects/section-comment-text"
import { SectionCommentDate } from "../entities/section-comment/value-objects/section-comment-date"
import { SectionId } from "../entities/section/value-objects/section-id"
import { CourseId } from "../value-objects/course-id"




export class SectionCommentCreated extends DomainEvent{
    protected constructor ( 
        public id: SectionCommentId,
        public text: SectionCommentText,
        public date: SectionCommentDate,
        public userId: string,
        public sectionId: SectionId,
        public courseId: CourseId)
    {
        super()
    }

    static create ( id: SectionCommentId, userId: string, text: SectionCommentText, date: SectionCommentDate, sectionId: SectionId, courseId: CourseId): SectionCommentCreated
    {
        return new SectionCommentCreated( id, text, date, userId, sectionId, courseId)
    }
}