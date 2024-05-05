import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { OrmBlogCommentMapper } from "../../mappers/orm-mappers/orm-blog-comment-mapper"
import { Repository, DataSource } from 'typeorm'
import { OrmBlog } from "../../entities/orm-entities/orm-blog"
import { OrmBlogComment } from "../../entities/orm-entities/orm-blog-comment"
import { OrmBlogImage } from "../../entities/orm-entities/orm-blog-image"
import { OrmBlogMapper } from "../../mappers/orm-mappers/orm-blog-mapper"
import { PaginationDto } from '../../../../common/Infraestructure/dto/entry/pagination.dto';



export class OrmBlogRepository extends Repository<OrmBlog> implements IBlogRepository
{

    private readonly ormBlogMapper: OrmBlogMapper
    private readonly ormBlogCommentMapper: OrmBlogCommentMapper

    private readonly ormBlogCommentRepository: Repository<OrmBlogComment>
    private readonly ormImageRepository: Repository<OrmBlogImage>
    constructor ( ormBlogMapper: OrmBlogMapper, ormBlogCommentMapper: OrmBlogCommentMapper, dataSource: DataSource )
    {
        super( OrmBlog, dataSource.createEntityManager() )
        this.ormBlogMapper = ormBlogMapper
        this.ormBlogCommentMapper = ormBlogCommentMapper
        this.ormBlogCommentRepository = dataSource.getRepository( OrmBlogComment )
        this.ormImageRepository = dataSource.getRepository( OrmBlogImage )
    }

    async findBlogById ( id: string ): Promise<Result<Blog>>
    {
        try
        {
            const blog = await this.findOneBy( { id } )
            if ( blog )
            {
                const blogImage = await this.ormImageRepository.findOneBy( { blog_id: id } )
                blog.image = blogImage

                return Result.success<Blog>( await this.ormBlogMapper.fromPersistenceToDomain( blog ), 200 )
            }
            return Result.fail<Blog>( new Error( 'Blog not found' ), 404, 'Blog not found' )
        } catch ( error )
        {
            return Result.fail<Blog>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findBlogsByTitle ( title: string, pagination: PaginationDto): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.createQueryBuilder( 'blog' ).where( 'LOWER(blog.title) LIKE :title', { title: `%${ title.toLowerCase().trim() }%` } ).take(pagination.limit).skip(pagination.offset).getMany()

            if ( blogs.length > 0 )
            {

                for ( const blog of blogs )
                {
                    const blogImage = await this.ormImageRepository.findOneBy( { blog_id: blog.id } )
                    blog.image = blogImage
                }
                return Result.success<Blog[]>( await Promise.all( blogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )
            }
            return Result.fail<Blog[]>( new Error( 'Blogs not found' ), 404, 'Blogs not found' )
        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findBlogsByCategory ( categoryId: string, pagination: PaginationDto): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.find( {where: { category_id: categoryId }, skip: pagination.offset, take: pagination.limit} )

            if ( blogs.length > 0 )
            {

                for ( const blog of blogs )
                {
                    const blogImage = await this.ormImageRepository.findOneBy( { blog_id: blog.id } )
                    blog.image = blogImage
                }
                return Result.success<Blog[]>( await Promise.all( blogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )
            }
            return Result.fail<Blog[]>( new Error( 'Blogs not found' ), 404, 'Blogs not found' )
        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findBlogComments ( blogId: string, pagination: PaginationDto): Promise<Result<BlogComment[]>>
    {
        try
        {
            const comments = await this.ormBlogCommentRepository.find({where: { blog_id: blogId }, skip: pagination.offset, take: pagination.limit })
            return Result.success<BlogComment[]>( await Promise.all( comments.map( async comment => await this.ormBlogCommentMapper.fromPersistenceToDomain( comment ) ) ), 200 )
        } catch ( error )
        {

            return Result.fail<BlogComment[]>( new Error( error.detail ), error.code, error.detail )

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
            return Result.fail<BlogComment>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findAllTrainerBlogs ( trainerId: string, pagination: PaginationDto): Promise<Result<Blog[]>>
    {
        try
        {
            const blogs = await this.find({where: { trainer_id: trainerId }, skip: pagination.offset, take: pagination.limit })
            if ( blogs.length > 0 )
            {

                for ( const blog of blogs )
                {
                    const blogImage = await this.ormImageRepository.findOneBy( { blog_id: blog.id } )
                    blog.image = blogImage
                }
                return Result.success<Blog[]>( await Promise.all( blogs.map( async blog => await this.ormBlogMapper.fromPersistenceToDomain( blog ) ) ), 200 )
            }
            return Result.fail<Blog[]>( new Error( 'Blogs not found' ), 404, 'Blogs not found' )
        } catch ( error )
        {
            return Result.fail<Blog[]>( new Error( error.detail ), error.code, error.detail )
        }
    }

}