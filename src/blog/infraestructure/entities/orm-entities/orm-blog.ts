import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmBlogComment } from "./orm-blog-comment"
import { OrmBlogImage } from "./orm-blog-image"
import { OrmTrainer } from "src/trainer/infraestructure/entities/orm-entities/trainer.entity"
import { OrmCategory } from "src/categories/infraesctructure/entities/orm-entities/orm-category"



@Entity( { name: 'blog' } )
export class OrmBlog
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) title: string
    @Column( 'varchar' ) body: string
    @Column( 'timestamp' ) publication_date: Date

    @Column( { type: "uuid" } ) trainer_id: string
    @ManyToOne( () => OrmTrainer, trainer => trainer.blogs, {eager: true}) @JoinColumn( {name: 'trainer_id'} ) trainer: OrmTrainer
    
    @Column( { type: "uuid" } ) category_id: string
    @ManyToOne( () => OrmCategory, category => category.blogs ) category: OrmCategory

    @OneToMany( () => OrmBlogImage, image => image.blog ) images: OrmBlogImage[]

    @OneToMany(()=> OrmBlogComment, comment => comment.blog) comments: OrmBlogComment[]

    static create ( id: string, title: string, body: string, publicationDate: Date, trainerId: string, categoryId: string, images: OrmBlogImage[]): OrmBlog
    {
        const blog = new OrmBlog()
        blog.id = id
        blog.title = title
        blog.body = body
        blog.publication_date = publicationDate
        blog.trainer_id = trainerId
        blog.category_id = categoryId
        blog.images = images
        return blog
    }

}