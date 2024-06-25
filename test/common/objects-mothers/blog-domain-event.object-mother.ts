import { BlogCommentDate } from "src/blog/domain/entities/value-objects/blog-comment-date"
import { BlogCommentId } from "src/blog/domain/entities/value-objects/blog-comment-id"
import { BlogCommentText } from "src/blog/domain/entities/value-objects/blog-comment-text"
import { BlogCommentCreated } from "src/blog/domain/events/blog-comment-created-event"
import { BlogCreated } from "src/blog/domain/events/blog-created-event"
import { BlogBody } from "src/blog/domain/value-objects/blog-body"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { BlogImage } from "src/blog/domain/value-objects/blog-image"
import { BlogPublicationDate } from "src/blog/domain/value-objects/blog-publication-date"
import { BlogTag } from "src/blog/domain/value-objects/blog-tag"
import { BlogTitle } from "src/blog/domain/value-objects/blog-title"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { Trainer } from "src/trainer/domain/trainer"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"
import { UserId } from "src/user/domain/value-objects/user-id"



export class BlogDomainEventObjectMother {
    static createBlogCreatedEvent(): BlogCreated {
        return BlogCreated.create(
            BlogId.create('c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
            BlogTitle.create('title'),
            BlogBody.create('body of the blog'),
            [BlogImage.create('url.com')],
            BlogPublicationDate.create(new Date()),
            TrainerId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            CategoryId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            [BlogTag.create('Tag')]
        )
    }

    static createBlogCommentCreatedEvent(userId: string, blogId: string): BlogCommentCreated {
        return BlogCommentCreated.create(
            BlogCommentId.create('c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
            UserId.create(userId),
            BlogCommentText.create('texts of the comment'),
            BlogCommentDate.create(new Date()),
            BlogId.create(blogId)
        )
    }
}