import { DomainEvent } from "src/common/Domain/domain-event/domain-event"



export class BlogCommentCreated extends DomainEvent{
    protected constructor ( 
        public id: string,
        public text: string,
        public date: Date,
        public userId: string,
        public blogId: string)
    {
        super()
    }

    static create ( id: string, userId: string, text: string, date: Date, blogId: string): BlogCommentCreated
    {
        return new BlogCommentCreated( id, text, date, userId, blogId)
    }
}