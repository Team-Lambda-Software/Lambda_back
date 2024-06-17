import { DomainEvent } from "src/common/Domain/domain-event/domain-event"

import { BlogCommentId } from "../entities/value-objects/blog-comment-id"
import { BlogCommentText } from "../entities/value-objects/blog-comment-text"
import { BlogCommentDate } from "../entities/value-objects/blog-comment-date"
import { BlogId } from "../value-objects/blog-id"



export class BlogCommentCreated extends DomainEvent{
    protected constructor ( 
        public id: BlogCommentId,
        public text: BlogCommentText,
        public date: BlogCommentDate,
        public userId: string,
        public blogId: BlogId)
    {
        super()
    }

    static create ( id: BlogCommentId, userId: string, text: BlogCommentText, date: BlogCommentDate, blogId: BlogId): BlogCommentCreated
    {
        return new BlogCommentCreated( id, text, date, userId, blogId)
    }
}