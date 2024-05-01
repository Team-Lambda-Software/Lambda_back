import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmBlogComment } from "./orm-blog-comment"
import { OrmBlogImage } from "./orm-blog-image"



@Entity( { name: 'blog' } )
export class OrmBlog
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) title: string
    @Column( 'varchar' ) body: string
    @Column( 'timestamp' ) publication_date: Date
    @Column( { type: "uuid" } ) trainer_id: string
    @Column( { type: "uuid" } ) category_id: string

    @Column( { type: "uuid", nullable: true } ) image_id: string
    @OneToOne( () => OrmBlogImage, { eager: true } ) @JoinColumn( { name: 'image_id' } ) image: OrmBlogImage

    @OneToMany(()=> OrmBlogComment, comment => comment.blog) comments: OrmBlogComment[]

    static create ( id: string, title: string, body: string, publicationDate: Date, trainerId: string, categoryId: string, image: OrmBlogImage): OrmBlog
    {
        const blog = new OrmBlog()
        blog.id = id
        blog.title = title
        blog.body = body
        blog.publication_date = publicationDate
        blog.trainer_id = trainerId
        blog.category_id = categoryId
        blog.image = image
        return blog
    }

}