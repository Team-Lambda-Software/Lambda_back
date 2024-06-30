import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { OrmBlogCommentMapper } from "../../mappers/orm-mappers/orm-blog-comment-mapper"
import { Repository, DataSource } from 'typeorm'
import { OrmBlog } from "../../entities/orm-entities/orm-blog"
import { OrmBlogComment } from "../../entities/orm-entities/orm-blog-comment"
import { OrmBlogImage } from "../../entities/orm-entities/orm-blog-image"
import { OrmBlogMapper } from "../../mappers/orm-mappers/orm-blog-mapper"
import { PaginationDto } from '../../../../common/Infraestructure/dto/entry/pagination.dto'
import { OrmBlogTags } from "../../entities/orm-entities/orm-blog-tags"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { BlogId } from "src/blog/domain/value-objects/blog-id"



export class OrmBlogRepository extends Repository<OrmBlog> implements IBlogRepository
{

    private readonly ormBlogMapper: OrmBlogMapper
    private readonly ormBlogCommentMapper: OrmBlogCommentMapper

    private readonly ormBlogCommentRepository: Repository<OrmBlogComment>
    private readonly ormImageRepository: Repository<OrmBlogImage>
    private readonly ormTagsRepository: Repository<OrmBlogTags>
    private readonly uuidGenerator: UuidGenerator
    constructor ( ormBlogMapper: OrmBlogMapper, ormBlogCommentMapper: OrmBlogCommentMapper, dataSource: DataSource )
    {
        super( OrmBlog, dataSource.createEntityManager() )
        this.ormBlogMapper = ormBlogMapper
        this.ormBlogCommentMapper = ormBlogCommentMapper
        this.ormBlogCommentRepository = dataSource.getRepository( OrmBlogComment )
        this.ormImageRepository = dataSource.getRepository( OrmBlogImage )
        this.ormTagsRepository = dataSource.getRepository( OrmBlogTags )
        this.uuidGenerator = new UuidGenerator()
    }
    async findBlogsByTagsAndTitle ( tags: string[], title: string, pagination: PaginationDto ): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.createQueryBuilder( 'blog' ).leftJoinAndSelect( 'blog.trainer', 'trainer' ).leftJoinAndSelect('blog.tags','tags').where( 'LOWER(blog.title) LIKE :title', { title: `%${ title.toLowerCase().trim() }%` } ).orderBy( 'blog.publication_date', 'DESC' ).getMany()
            
            let filteredBlogs = blogs.filter( blog => tags.every( tag => blog.tags.some( blogTag => blogTag.name === tag ) ) )
            if ( filteredBlogs.length <= pagination.page && filteredBlogs.length > 0 )
                return Result.fail<Blog[]>( new Error( 'page execedes lenght of blogs' ), 404, 'page execedes lenght of blogs' )

            filteredBlogs = filteredBlogs.slice( pagination.page, pagination.perPage )

            for ( const blog of filteredBlogs )
            {
                const blogImages = await this.ormImageRepository.findBy( { blog_id: blog.id } )
                blog.images = blogImages

            }
            return Result.success<Blog[]>( await Promise.all( filteredBlogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )


        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.message ), error.code, error.message )
        }
    }
    async saveBlogAggregate ( blog: Blog ): Promise<Result<Blog>>
    {
        try
        {

            const newBlog = await this.ormBlogMapper.fromDomainToPersistence( blog )
            const tags = this.ormTagsRepository.create( blog.Tags.map( tag => { return { name: tag.Value } } ) )
            await this.ormTagsRepository.save( tags )
            await this.save( newBlog )
            for ( const image of blog.Images )
            {
                const newImage = this.ormImageRepository.create( { url: image.Value, blog_id: newBlog.id } )
                await this.ormImageRepository.save( newImage )
            }
            return Result.success<Blog>( blog, 200 )

        } catch ( error )
        {
            return Result.fail<Blog>( new Error( error.message ), error.code, error.message )
        }
    }
    async findBlogCommentCount ( blogId: string ): Promise<Result<number>>
    {
        try
        {
            const comments = await this.ormBlogCommentRepository.find( { where: { blog_id: blogId } } )
            return Result.success<number>( comments.length, 200 )
        } catch ( error )
        {

            return Result.fail<number>( new Error( error.message ), error.code, error.message )

        }
    }
    async findBlogsByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.find( { where: { trainer_id: trainerId }, order: { publication_date: 'DESC' }, skip: pagination.page, take: pagination.perPage } )


            for ( const blog of blogs )
            {
                const blogImages = await this.ormImageRepository.findBy( { blog_id: blog.id } )
                blog.images = blogImages
            }
            return Result.success<Blog[]>( await Promise.all( blogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async findBlogsByTags ( tags: string[], pagination: PaginationDto ): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.find( { order: { publication_date: 'DESC' } } )
            let filteredBlogs = blogs.filter( blog => tags.every( tag => blog.tags.some( blogTag => blogTag.name === tag ) ) )

            if ( filteredBlogs.length <= pagination.page && filteredBlogs.length > 0 )
                return Result.fail<Blog[]>( new Error( 'page execedes lenght of blogs' ), 404, 'page execedes lenght of blogs' )

            filteredBlogs = filteredBlogs.slice( pagination.page, pagination.perPage )



            for ( const blog of filteredBlogs )
            {
                const blogImages = await this.ormImageRepository.findBy( { blog_id: blog.id } )
                blog.images = blogImages

            }
            return Result.success<Blog[]>( await Promise.all( filteredBlogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async findBlogById ( id: BlogId ): Promise<Result<Blog>>
    {
        try
        {
            const blog = await this.findOneBy( { id: id.Value } )
            if ( blog )
            {
                const blogImages = await this.ormImageRepository.findBy( { blog_id: id.Value } )
                blog.images = blogImages

                return Result.success<Blog>( await this.ormBlogMapper.fromPersistenceToDomain( blog ), 200 )
            }
            return Result.fail<Blog>( new Error( 'Blog not found' ), 404, 'Blog not found' )
        } catch ( error )
        {
            return Result.fail<Blog>( new Error( error.message ), error.code, error.message )
        }
    }

    async findBlogsByTitle ( title: string, pagination: PaginationDto ): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.createQueryBuilder( 'blog' ).leftJoinAndSelect( 'blog.trainer', 'trainer' ).where( 'LOWER(blog.title) LIKE :title', { title: `%${ title.toLowerCase().trim() }%` } ).orderBy( 'blog.publication_date', 'DESC' ).take( pagination.perPage ).skip( pagination.page ).getMany()


            for ( const blog of blogs )
            {
                const blogImages = await this.ormImageRepository.findBy( { blog_id: blog.id } )
                blog.images = blogImages
            }
            return Result.success<Blog[]>( await Promise.all( blogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async findBlogsByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.find( { where: { category_id: categoryId }, order: { publication_date: 'DESC' }, skip: pagination.page, take: pagination.perPage } )

            for ( const blog of blogs )
            {
                const blogImages = await this.ormImageRepository.findBy( { blog_id: blog.id } )
                blog.images = blogImages
            }
            return Result.success<Blog[]>( await Promise.all( blogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async findBlogComments ( blogId: string, pagination: PaginationDto ): Promise<Result<BlogComment[]>>
    {
        try
        {
            const comments = await this.ormBlogCommentRepository.find( { where: { blog_id: blogId }, skip: pagination.page, take: pagination.perPage } )
            return Result.success<BlogComment[]>( await Promise.all( comments.map( async comment => await this.ormBlogCommentMapper.fromPersistenceToDomain( comment ) ) ), 200 )
        } catch ( error )
        {

            return Result.fail<BlogComment[]>( new Error( error.message ), error.code, error.message )

        }
    }

    async addCommentToBlog ( comment: BlogComment ): Promise<Result<BlogComment>>
    {
        try
        {
            const newComment: OrmBlogComment = await this.ormBlogCommentMapper.fromDomainToPersistence( comment )
            await this.ormBlogCommentRepository.save( newComment )
            return Result.success<BlogComment>( await this.ormBlogCommentMapper.fromPersistenceToDomain( newComment ), 200 )
        } catch ( error )
        {
            return Result.fail<BlogComment>( new Error( error.message ), error.code, error.message )
        }
    }

    async findAllTrainerBlogs ( trainerId: string, pagination: PaginationDto ): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.find( { where: { trainer_id: trainerId }, order: { publication_date: 'DESC' }, skip: pagination.page, take: pagination.perPage } )

            for ( const blog of blogs )
            {
                const blogImages = await this.ormImageRepository.findBy( { blog_id: blog.id } )
                blog.images = blogImages
            }
            return Result.success<Blog[]>( await Promise.all( blogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.message ), error.code, error.message )
        }
    }

}