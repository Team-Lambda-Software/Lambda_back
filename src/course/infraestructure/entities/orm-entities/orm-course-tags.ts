import { Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"
import { OrmCourse } from "./orm-course"



@Entity( { name: 'course_tags' } )
export class OrmCourseTags
{

    @PrimaryColumn( { type: "text" } ) name: string

    @ManyToMany( () => OrmCourse) 
    @JoinTable( { 
        name: 'c_t',
        joinColumn: { name: 'tag_name', referencedColumnName: 'name', foreignKeyConstraintName: 'fk_tag_name'},
        inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_course_id'} 
     } ) 
    courses: OrmCourse[]

    static create ( name: string ): OrmCourseTags
    {
        const tag = new OrmCourseTags()
        tag.name = name
        return tag
    }

}