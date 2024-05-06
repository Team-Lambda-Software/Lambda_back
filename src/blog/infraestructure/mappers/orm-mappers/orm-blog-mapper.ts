import { Blog } from "src/blog/domain/blog"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { OrmBlog } from "../../entities/orm-entities/orm-blog"
import { BlogImage } from "src/blog/domain/entities/blog-image"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"

export class OrmBlogMapper implements IMapper<Blog, OrmBlog>
{

    private readonly ormTrainerMapper: OrmTrainerMapper

    constructor ( ormTrainerMapper: OrmTrainerMapper )
    {
        this.ormTrainerMapper = ormTrainerMapper
    }

    fromDomainToPersistence ( domain: Blog ): Promise<OrmBlog>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmBlog ): Promise<Blog>
    {
        let image: BlogImage = BlogImage.create('empty', 'empty');
        if (persistence.image)
            image = BlogImage.create(persistence.image.url, persistence.image.id)

        const blog: Blog = Blog.create( persistence.id, persistence.title, persistence.body, image, persistence.publication_date, await this.ormTrainerMapper.fromPersistenceToDomain(persistence.trainer), persistence.category_id )
        return blog
    }

}