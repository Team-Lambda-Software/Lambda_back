import { Trainer } from "src/trainer/domain/trainer"
import { AggregateRoot } from "src/common/Domain/aggregate-root/aggregate-root"
import { BlogId } from "./value-objects/blog-id"
import { BlogTitle } from "./value-objects/blog-title"
import { BlogBody } from "./value-objects/blog-body"
import { BlogImage } from "./value-objects/blog-image"
import { BlogPublicationDate } from "./value-objects/blog-publication-date"
import { BlogTag } from "./value-objects/blog-tag"
import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { InvalidBlogException } from "./exceptions/invalid-blog-exception"
import { BlogCreated } from "./events/blog-created-event"
import { BlogCommentDate } from "./entities/value-objects/blog-comment-date"
import { BlogCommentText } from "./entities/value-objects/blog-comment-text"
import { BlogCommentId } from "./entities/value-objects/blog-comment-id"
import { BlogCommentCreated } from "./events/blog-comment-created-event"
import { BlogComment } from "./entities/blog-comment"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { UserId } from "src/user/domain/value-objects/user-id"




export class Blog extends AggregateRoot<BlogId>{

    private title: BlogTitle
    private body: BlogBody
    private images: BlogImage[]
    private publicationDate: BlogPublicationDate
    private trainer: Trainer
    private categoryId: CategoryId
    private tags: BlogTag[]

    protected constructor ( id: BlogId, title: BlogTitle, body: BlogBody, images: BlogImage[], publicationDate: BlogPublicationDate, trainer: Trainer, categoryId: CategoryId, tags: BlogTag[])
    {
        const blogCreated: BlogCreated = BlogCreated.create(id,title,body,images,publicationDate,trainer, categoryId, tags)
        super( id, blogCreated)
    }

    protected applyEvent ( event: DomainEvent ): void
    {
        switch (event.eventName){
            case 'BlogCreated':
                const blogCreated: BlogCreated = event as BlogCreated
                this.title = blogCreated.title
                this.body = blogCreated.body
                this.tags = blogCreated.tags
                this.categoryId = blogCreated.categoryId
                this.images = blogCreated.images
                this.publicationDate = blogCreated.publicationDate
                this.trainer = blogCreated.trainer 
        }
    }


    protected ensureValidState (): void
    {
        if (!this.Body || !this.title || !this.CategoryId || !this.PublicationDate || !this.trainer)
            throw new InvalidBlogException()
    }

    get Title (): BlogTitle
    {
        return this.title
    }

    get Body (): BlogBody
    {
        return this.body
    }

    get Images (): BlogImage[]
    {
        return this.images
    }

    get PublicationDate (): BlogPublicationDate
    {
        return this.publicationDate
    }

    get Trainer (): Trainer
    {
        return this.trainer
    }

    get CategoryId (): CategoryId
    {
        return this.categoryId
    }

    get Tags (): BlogTag[]
    {
        return this.tags
    }

    public createComment (id: BlogCommentId, userId: UserId, text: BlogCommentText, date: BlogCommentDate): BlogComment{
        const comment: BlogComment = BlogComment.create(id, userId, text, date, this.Id)
        const blogCommentCreated: BlogCommentCreated = BlogCommentCreated.create(id, userId, text, date, this.Id)
        this.onEvent(blogCommentCreated)
        return comment
    }

    static create ( id: BlogId, title: BlogTitle, body: BlogBody, images: BlogImage[], publicationDate: BlogPublicationDate, trainer: Trainer, categoryId: CategoryId, tags: BlogTag[]): Blog
    {
        return new Blog( id, title, body, images, publicationDate, trainer, categoryId, tags)
    }

}