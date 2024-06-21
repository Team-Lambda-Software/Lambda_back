import { Blog } from "src/blog/domain/blog"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OdmBlogEntity } from "../../entities/odm-entities/odm-blog.entity"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { BlogTitle } from "src/blog/domain/value-objects/blog-title"
import { BlogBody } from "src/blog/domain/value-objects/blog-body"
import { BlogPublicationDate } from "src/blog/domain/value-objects/blog-publication-date"
import { BlogImage } from "src/blog/domain/value-objects/blog-image"
import { Trainer } from "src/trainer/domain/trainer"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { BlogTag } from "src/blog/domain/value-objects/blog-tag"

export class OdmBlogMapper implements IMapper<Blog, OdmBlogEntity>
{
    fromDomainToPersistence ( domain: Blog ): Promise<OdmBlogEntity>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( resultBlog: OdmBlogEntity ): Promise<Blog>
    {
        return Blog.create(BlogId.create(resultBlog.id), 
        BlogTitle.create(resultBlog.title), 
        BlogBody.create(resultBlog.body), 
        resultBlog.images.map(image => BlogImage.create(image.url)), 
        BlogPublicationDate.create(resultBlog.publication_date), 
        Trainer.create(resultBlog.trainer.id, resultBlog.trainer.first_name, resultBlog.trainer.first_last_name, 
            resultBlog.trainer.second_last_name, resultBlog.trainer.email, resultBlog.trainer.phone, 
            resultBlog.trainer.followers.map(follower => follower.id), 
            resultBlog.trainer.latitude, resultBlog.trainer.longitude), 
        CategoryId.create(resultBlog.category.id), 
        resultBlog.tags.map(tag => BlogTag.create(tag)))
    }
}