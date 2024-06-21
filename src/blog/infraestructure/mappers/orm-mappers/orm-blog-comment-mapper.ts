import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmBlogComment } from "../../entities/orm-entities/orm-blog-comment"
import { BlogComment } from "src/blog/domain/entities/blog-comment"


export class OrmBlogCommentMapper implements IMapper<BlogComment, OrmBlogComment>
{
    async fromDomainToPersistence ( domain: BlogComment ): Promise<OrmBlogComment>
    {
        return OrmBlogComment.create( domain.Id, domain.Text, domain.UserId, domain.Date, domain.BlogId)
    }
    async fromPersistenceToDomain ( persistence: OrmBlogComment ): Promise<BlogComment>
    {
        return BlogComment.create( persistence.id, persistence.user_id, persistence.text, persistence.date, persistence.blog_id )
    }

}
