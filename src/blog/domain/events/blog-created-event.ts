import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { BlogId } from "../value-objects/blog-id"
import { BlogTitle } from "../value-objects/blog-title"
import { BlogBody } from "../value-objects/blog-body"
import { BlogImage } from "../value-objects/blog-image"
import { BlogPublicationDate } from "../value-objects/blog-publication-date"
import { Trainer } from "src/trainer/domain/trainer"
import { BlogTag } from "../value-objects/blog-tag"



export class BlogCreated extends DomainEvent{
    protected constructor ( 
        public id: BlogId,
        public title: BlogTitle,
        public body: BlogBody,
        public images: BlogImage[],
        public publicationDate: BlogPublicationDate,
        public trainer: Trainer,
        public categoryId: string,
        public tags: BlogTag[])
    {
        super()
    }

    static create ( id: BlogId, title: BlogTitle, body: BlogBody, images: BlogImage[], publicationDate: BlogPublicationDate, trainer: Trainer, categoryId: string, tags: BlogTag[]): BlogCreated
    {
        return new BlogCreated( id, title, body, images, publicationDate, trainer, categoryId, tags)
    }
}