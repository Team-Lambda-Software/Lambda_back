import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm"
import { OrmBlog } from "./orm-blog"



@Entity( { name: 'blog_image' } )
export class OrmBlogImage
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) url: string

    @Column( { type: "uuid", nullable: true } ) blog_id: string
    @OneToOne( () => OrmBlog, { eager: true } ) @JoinColumn( { name: 'blog_id' } ) course: OrmBlog

    static create ( id: string, url: string ): OrmBlogImage
    {
        const video = new OrmBlogImage()
        video.id = id
        video.url = url
        return video
    }

}