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
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"




export class Blog extends AggregateRoot<BlogId>{

    private title: BlogTitle
    private body: BlogBody
    private images: BlogImage[]
    private publicationDate: BlogPublicationDate
    private trainerId: TrainerId
    private categoryId: CategoryId
    private tags: BlogTag[]

    protected constructor ( id: BlogId, title: BlogTitle, body: BlogBody, images: BlogImage[], publicationDate: BlogPublicationDate, trainerId: TrainerId, categoryId: CategoryId, tags: BlogTag[])
    {
        const blogCreated: BlogCreated = BlogCreated.create(id.Value,title.Value,body.Value,images.map(image => image.Value),publicationDate.Value, trainerId.Value, categoryId.Value, tags.map(tag => tag.Value))
        super( id, blogCreated)
    }

    protected applyEvent ( event: DomainEvent ): void
    {
        switch (event.eventName){
            case 'BlogCreated':
                const blogCreated: BlogCreated = event as BlogCreated
                this.title = BlogTitle.create(blogCreated.title)
                this.body = BlogBody.create(blogCreated.body)
                this.tags = blogCreated.tags.map(tag => BlogTag.create(tag))
                this.categoryId = CategoryId.create(blogCreated.categoryId)
                this.images = blogCreated.images.map(image => BlogImage.create(image))
                this.publicationDate = BlogPublicationDate.create(blogCreated.publicationDate)
                this.trainerId = TrainerId.create(blogCreated.trainerId)
        }
    }


    protected ensureValidState (): void
    {
        if (!this.Body || !this.title || !this.CategoryId || !this.PublicationDate || !this.trainerId)
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

    get TrainerId (): TrainerId
    {
        return this.trainerId
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
        const blogCommentCreated: BlogCommentCreated = BlogCommentCreated.create(id.Value, userId.Id, text.Value, date.Value, this.Id.Value)
        this.onEvent(blogCommentCreated)
        return comment
    }

    static create ( id: BlogId, title: BlogTitle, body: BlogBody, images: BlogImage[], publicationDate: BlogPublicationDate, trainerId: TrainerId, categoryId: CategoryId, tags: BlogTag[]): Blog
    {
        return new Blog( id, title, body, images, publicationDate, trainerId, categoryId, tags)
    }

}