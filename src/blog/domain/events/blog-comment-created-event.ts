import { DomainEvent } from "src/common/Domain/domain-event/domain-event"

import { BlogCommentId } from "../entities/value-objects/blog-comment-id"
import { BlogCommentText } from "../entities/value-objects/blog-comment-text"
import { BlogCommentDate } from "../entities/value-objects/blog-comment-date"
import { BlogId } from "../value-objects/blog-id"
import { UserId } from "src/user/domain/value-objects/user-id"



export class BlogCommentCreated extends DomainEvent{
    protected constructor ( 
        public id: BlogCommentId,
        public text: BlogCommentText,
        public date: BlogCommentDate,
        public userId: UserId,
        public blogId: BlogId)
    {
        super()
    }

    static create ( id: BlogCommentId, userId: UserId, text: BlogCommentText, date: BlogCommentDate, blogId: BlogId): BlogCommentCreated
    {
        return new BlogCommentCreated( id, text, date, userId, blogId)
    }
}