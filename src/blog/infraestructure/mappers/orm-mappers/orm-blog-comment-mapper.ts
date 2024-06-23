import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmBlogComment } from "../../entities/orm-entities/orm-blog-comment"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { BlogCommentId } from "src/blog/domain/entities/value-objects/blog-comment-id"
import { BlogCommentText } from "src/blog/domain/entities/value-objects/blog-comment-text"
import { BlogCommentDate } from "src/blog/domain/entities/value-objects/blog-comment-date"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { UserId } from "src/user/domain/value-objects/user-id"


export class OrmBlogCommentMapper implements IMapper<BlogComment, OrmBlogComment>
{
    async fromDomainToPersistence ( domain: BlogComment ): Promise<OrmBlogComment>
    {
        return OrmBlogComment.create( domain.Id.Value, domain.Text.Value, domain.UserId.Id, domain.Date.Value, domain.BlogId.Value)
    }
    async fromPersistenceToDomain ( persistence: OrmBlogComment ): Promise<BlogComment>
    {
        return BlogComment.create( BlogCommentId.create(persistence.id), UserId.create(persistence.user_id), BlogCommentText.create(persistence.text), BlogCommentDate.create(persistence.date), BlogId.create(persistence.blog_id) )
    }

}
