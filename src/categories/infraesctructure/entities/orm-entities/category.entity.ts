import { Blog } from "src/blog/domain/blog"
import { OrmBlog } from "src/blog/infraestructure/entities/orm-entities/orm-blog"
import { Course } from "src/course/domain/course"
import { OrmCourse } from "src/course/infraestructure/entities/orm-entities/orm-course"
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"



@Entity({ name: 'category' } )
export class OrmCategory
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) categoryName: string
    @Column( 'varchar' ) description: string

    // @OneToMany(()=> OrmCourse, course => course.category)
    // course: OrmCourse[]

    // @OneToMany(()=> OrmBlog, blog => blog.category)
    // blog: OrmBlog[]

    static create ( id: string, categoryName: string, description: string)
    {
        const categorie = new OrmCategory()
        categorie.id = id
        categorie.categoryName = categoryName
        categorie.description = description
        return categorie
    }


}