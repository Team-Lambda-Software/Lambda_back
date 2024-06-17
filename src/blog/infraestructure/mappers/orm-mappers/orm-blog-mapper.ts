import { Blog } from "src/blog/domain/blog"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmBlog } from "../../entities/orm-entities/orm-blog"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { OrmBlogImage } from "../../entities/orm-entities/orm-blog-image"
import { OrmBlogTags } from "../../entities/orm-entities/orm-blog-tags"
import { BlogImage } from "src/blog/domain/value-objects/blog-image"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { BlogTitle } from "src/blog/domain/value-objects/blog-title"
import { BlogBody } from "src/blog/domain/value-objects/blog-body"
import { BlogPublicationDate } from "src/blog/domain/value-objects/blog-publication-date"
import { BlogTag } from "src/blog/domain/value-objects/blog-tag"

export class OrmBlogMapper implements IMapper<Blog, OrmBlog>
{

    private readonly ormTrainerMapper: OrmTrainerMapper

    constructor ( ormTrainerMapper: OrmTrainerMapper )
    {
        this.ormTrainerMapper = ormTrainerMapper
    }

    async fromDomainToPersistence ( domain: Blog ): Promise<OrmBlog>
    {
        const images: OrmBlogImage[] = []
        domain.Images.forEach( image => {
            images.push( OrmBlogImage.create( image.Value ) )
        })
        const tags: OrmBlogTags[] = []
        domain.Tags.forEach( tag => {
            tags.push( OrmBlogTags.create( tag.Value ) )
        })
        const blog = OrmBlog.create( domain.Id.Value, domain.Title.Value, domain.Body.Value, domain.PublicationDate.Value, domain.Trainer.Id, domain.CategoryId, images, tags)
        return blog
    }
    async fromPersistenceToDomain ( persistence: OrmBlog ): Promise<Blog>
    {
        let images: BlogImage[] = []
        if (persistence.images)
            for ( const image of persistence.images)
                images.push (BlogImage.create(image.url))
        
        let tags: BlogTag[] = []
        if (persistence.tags)
            for ( const tag of persistence.tags )
                tags.push(BlogTag.create(tag.name))

        const blog: Blog = Blog.create( 
            BlogId.create(persistence.id), 
            BlogTitle.create(persistence.title), 
            BlogBody.create(persistence.body), 
            images, 
            BlogPublicationDate.create(persistence.publication_date),
            await this.ormTrainerMapper.fromPersistenceToDomain(persistence.trainer), 
            persistence.category_id, 
            tags)
        return blog
    }

}