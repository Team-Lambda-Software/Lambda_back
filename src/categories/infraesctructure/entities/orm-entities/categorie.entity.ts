import { Blog } from "src/blog/domain/blog"
import { OrmBlog } from "src/blog/infraestructure/entities/orm-entities/orm-blog"
import { Course } from "src/course/domain/course"
import { OrmCourse } from "src/course/infraestructure/entities/orm-entities/orm-course"
import { Column, Entity, PrimaryColumn, OneToMany1, OneToMany2 } from "typeorm"



@Entity({ name: 'categorie' } )
export class OrmCategorie
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) categorieName: string
    @Column( 'varchar' ) description: string

    @OneToMany1(()=> OrmCourse, course => course.categorie)
    course: OrmCourse[]

    @OneToMany2(()=> OrmBlog, blog => blog.categorie)
    blog: OrmBlog[]

    static create ( id: string, categorieName: string, description: string)
    {
        const categorie = new OrmCategorie()
        categorie.id = id
        categorie.categorieName = categorieName
        categorie.description = description
        return categorie
    }


}