import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { SectionCommentId } from "../entities/section-comment/value-objects/section-comment-id"
import { SectionCommentText } from "../entities/section-comment/value-objects/section-comment-text"
import { SectionCommentDate } from "../entities/section-comment/value-objects/section-comment-date"
import { SectionId } from "../entities/section/value-objects/section-id"
import { CourseId } from "../value-objects/course-id"
import { UserId } from "src/user/domain/value-objects/user-id"




export class SectionCommentCreated extends DomainEvent{
    protected constructor ( 
        public id: string,
        public text: string,
        public date: Date,
        public userId: string,
        public sectionId: string,
        public courseId: string)
    {
        super()
    }

    static create ( id: string, userId: string, text: string, date: Date, sectionId: string, courseId: string): SectionCommentCreated
    {
        return new SectionCommentCreated( id, text, date, userId, sectionId, courseId)
    }
}