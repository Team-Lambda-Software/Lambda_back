import { Blog } from "src/blog/domain/blog"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmBlog } from "../../entities/orm-entities/orm-blog"
import { BlogImage } from "src/blog/domain/entities/blog-image"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { OrmBlogImage } from "../../entities/orm-entities/orm-blog-image"
import { OrmBlogTags } from "../../entities/orm-entities/orm-blog-tags"

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
            images.push( OrmBlogImage.create( image.Id, image.Url ) )
        })
        const tags: OrmBlogTags[] = []
        domain.Tags.forEach( tag => {
            tags.push( OrmBlogTags.create( tag ) )
        })
        const blog = OrmBlog.create( domain.Id, domain.Title, domain.Body, domain.PublicationDate, domain.Trainer.Id, domain.CategoryId, images, tags)
        return blog
    }
    async fromPersistenceToDomain ( persistence: OrmBlog ): Promise<Blog>
    {
        let images: BlogImage[] = []
        if (persistence.images)
            for ( const image of persistence.images)
                images.push (BlogImage.create(image.url, image.id))
        
        let tags: string[] = []
        if (persistence.tags)
            for ( const tag of persistence.tags )
                tags.push(tag.name)

        const blog: Blog = Blog.create( persistence.id, persistence.title, persistence.body, images, persistence.publication_date, await this.ormTrainerMapper.fromPersistenceToDomain(persistence.trainer), persistence.category_id, tags)
        return blog
    }

}