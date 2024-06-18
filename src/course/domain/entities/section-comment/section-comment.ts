import { Entity } from "src/common/Domain/entity/entity"
import { SectionCommentId } from "./value-objects/section-comment-id"
import { SectionCommentText } from "./value-objects/section-comment-text"
import { SectionCommentDate } from "./value-objects/section-comment-date"
import { InvalidSectionCommentException } from "./exceptions/invalid-section-comment-exception"
import { SectionId } from "../section/value-objects/section-id"




export class SectionComment extends Entity<SectionCommentId>
{

    private userId: string
    private text: SectionCommentText
    private date: SectionCommentDate
    private sectionId: SectionId

    get UserId ()
    {
        return this.userId
    }

    get Text ()
    {
        return this.text
    }

    get Date ()
    {
        return this.date
    }

    get SectionId ()
    {
        return this.sectionId
    }

    protected constructor ( id: SectionCommentId, userId: string, text: SectionCommentText, date: SectionCommentDate, sectionId: SectionId )
    {
        super( id )
        this.userId = userId
        this.text = text
        this.date = date
        this.sectionId = sectionId
        this.ensureValidState()
    }

    protected ensureValidState (): void
    {
        if ( !this.userId || !this.text || !this.sectionId || !this.date)
            throw new InvalidSectionCommentException()

    }

    static create ( id: SectionCommentId, userId: string, text: SectionCommentText, date: SectionCommentDate, sectionId: SectionId ): SectionComment
    {
        return new SectionComment( id, userId, text, date, sectionId)
    }

}