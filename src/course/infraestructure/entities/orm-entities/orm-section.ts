import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { OrmCourse } from "./orm-course"



@Entity( { name: 'section' } )
export class OrmSection
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) name: string
    @Column( 'varchar' ) description: string
    @Column( 'varchar', { nullable: true } ) text: string

    @Column( { type: "uuid" } ) course_id: string
    @ManyToOne( () => OrmCourse, { eager: true, nullable: true } ) @JoinColumn( { name: 'course_id' } ) course: OrmCourse

    //TODO buscar el curso dado el id para asignarselo a la entity
    static create ( id: string, name: string, description: string, text?: string ): OrmSection
    {
        const section = new OrmSection()
        section.id = id
        section.name = name
        section.description = description
        section.text = text
        return section
    }

}