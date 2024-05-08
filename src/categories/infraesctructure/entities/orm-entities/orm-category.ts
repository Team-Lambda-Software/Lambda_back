import { Blog } from "src/blog/domain/blog"
import { OrmBlog } from "src/blog/infraestructure/entities/orm-entities/orm-blog"
import { Course } from "src/course/domain/course"
import { OrmCourse } from "src/course/infraestructure/entities/orm-entities/orm-course"
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmCategoryIcon } from "./orm-category-icon"



@Entity({ name: 'category' } )
export class OrmCategory
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) categoryName: string
    @Column( 'varchar' ) description: string

    @Column( { type: "uuid", nullable: true } ) icon_id: string
    @OneToOne(()=> OrmCategoryIcon, {eager: true}) @JoinColumn({name: 'icon_id'}) icon: OrmCategoryIcon

    @OneToMany(()=> OrmCourse, course => course.category)
    courses: OrmCourse[]

    @OneToMany(()=> OrmBlog, blog => blog.category)
    blogs: OrmBlog[]

    static create ( id: string, categoryName: string, description: string)
    {
        const categorie = new OrmCategory()
        categorie.id = id
        categorie.categoryName = categoryName
        categorie.description = description
        return categorie
    }


}