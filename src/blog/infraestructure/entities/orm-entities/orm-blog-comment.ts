import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity"
import { OrmBlog } from "./orm-blog"



@Entity( { name: 'blog_comment' } )
export class OrmBlogComment
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) text: string
    @Column( 'timestamp' ) date: Date

    @Column( { type: "uuid" } ) user_id: string
    @ManyToOne( () => OrmUser, { eager: true } ) @JoinColumn( { name: 'user_id' } ) user: OrmUser

    @Column( { type: "uuid" } ) blog_id: string
    @ManyToOne( () => OrmBlog, { eager: true } ) @JoinColumn( { name: 'blog_id' } ) blog: OrmBlog

    //TODO buscar la seccion dado el id para asignarselo a la entity
    static create ( id: string, text: string, userId: string, date: Date, blogId: string ): OrmBlogComment
    {
        const comment = new OrmBlogComment()
        comment.id = id
        comment.text = text
        comment.user_id = userId
        comment.date = date
        comment.blog_id = blogId
        return comment
    }

}