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
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { OdmBlogEntity } from "../../entities/odm-entities/odm-blog.entity"
import { OdmTrainerMapper } from "src/trainer/infraestructure/mappers/odm-mapper/odm-trainer-mapper"
import { Model } from "mongoose"

export class OdmBlogMapper implements IMapper<Blog, OdmBlogEntity>
{

    private readonly odmTrainerMapper: OdmTrainerMapper
    private readonly blogModel: Model<OdmBlogEntity>
    constructor ( odmTrainerMapper: OdmTrainerMapper, blogModel: Model<OdmBlogEntity>)
    {
        this.odmTrainerMapper = odmTrainerMapper
        this.blogModel = blogModel
    }

    async fromDomainToPersistence ( domain: Blog ): Promise<OdmBlogEntity>
    {

        const blog = new this.blogModel({
            id: domain.Id.Value,
            title: domain.Title.Value,
            body: domain.Body.Value,
            images: domain.Images.map( image => image.Value),
            publication_date: domain.PublicationDate.Value,
            trainer: await this.odmTrainerMapper.fromDomainToPersistence(domain.Trainer),
            category: domain.CategoryId.Value,
            tags: domain.Tags.map( tag => tag.Value)
        })
    }
    async fromPersistenceToDomain ( persistence: OdmBlogEntity ): Promise<Blog>
    {
        let images: BlogImage[] = []
        if (persistence.images)
            for ( const image of persistence.images)
                images.push (BlogImage.create(image.url))
        
        let tags: BlogTag[] = []
        if (persistence.tags)
            for ( const tag of persistence.tags )
                tags.push(BlogTag.create(tag))

        const blog: Blog = Blog.create( 
            BlogId.create(persistence.id), 
            BlogTitle.create(persistence.title), 
            BlogBody.create(persistence.body), 
            images, 
            BlogPublicationDate.create(persistence.publication_date),
            await this.odmTrainerMapper.fromPersistenceToDomain(persistence.trainer), 
            CategoryId.create(persistence.category.id), 
            tags)
        return blog
    }

}