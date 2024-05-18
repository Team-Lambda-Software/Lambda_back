import { Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"
import { OrmBlog } from "./orm-blog"



@Entity( { name: 'blog_tags' } )
export class OrmBlogTags
{

    @PrimaryColumn( { type: "text" } ) name: string

    @ManyToMany( () => OrmBlog) 
    @JoinTable( { 
        name: 'b_t',
        joinColumn: { name: 'tag_name', referencedColumnName: 'name', foreignKeyConstraintName: 'fk_tag_name'},
        inverseJoinColumn: { name: 'blog_id', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_blog_id'} 
     } ) 
    blogs: OrmBlog[]

    static create ( name: string ): OrmBlogTags
    {
        const tag = new OrmBlogTags() 
        tag.name = name
        return tag
    }

}