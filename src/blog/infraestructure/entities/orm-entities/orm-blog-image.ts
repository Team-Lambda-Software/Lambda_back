import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm"
import { OrmBlog } from "./orm-blog"



@Entity( { name: 'blog_image' } )
export class OrmBlogImage
{

    @PrimaryColumn( { type: "varchar" } ) url: string

    @Column( { type: "uuid", nullable: true } ) blog_id: string
    @ManyToOne( () => OrmBlog, { eager: true } ) @JoinColumn( { name: 'blog_id' } ) blog: OrmBlog

    static create ( url: string ): OrmBlogImage
    {
        const blog = new OrmBlogImage()
        blog.url = url
        return blog
    }

}