import { DomainEvent } from "src/common/Domain/domain-event/domain-event"


export class BlogCreated extends DomainEvent{
    protected constructor ( 
        public id: string,
        public title: string,
        public body: string,
        public images: string[],
        public publicationDate: Date,
        public trainerId: string,
        public categoryId: string,
        public tags: string[])
    {
        super()
    }

    static create ( id: string, title: string, body: string, images: string[], publicationDate: Date, trainerId: string, categoryId: string, tags: string[]): BlogCreated
    {
        return new BlogCreated( id, title, body, images, publicationDate, trainerId, categoryId, tags)
    }
}