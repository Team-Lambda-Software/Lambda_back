import { Blog } from "src/blog/domain/blog"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmBlog } from "../../entities/orm-entities/orm-blog"
import { BlogImage } from "src/blog/domain/entities/blog-image"

export class OrmCourseMapper implements IMapper<Blog, OrmBlog>
{

    fromDomainToPersistence ( domain: Blog ): Promise<OrmBlog>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmBlog ): Promise<Blog>
    {
        const blog: Blog = Blog.create( persistence.id, persistence.title, persistence.body, BlogImage.create(persistence.image.id,persistence.image.url), persistence.publication_date, persistence.trainer_id, persistence.category_id )
        return blog
    }

}