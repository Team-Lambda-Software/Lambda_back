import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { OrmSection } from "./orm-section"



@Entity( { name: 'section_comment' } )
export class OrmSectionComment
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) text: string
    @Column( 'timestamp' ) date: Date

    @Column( { type: "uuid" } ) section_id: string
    @ManyToOne( () => OrmSection, { eager: true } ) @JoinColumn( { name: 'section_id' } ) section: OrmSection

    //TODO buscar la seccion dado el id para asignarselo a la entity
    static create ( id: string, text: string ): OrmSectionComment
    {
        const comment = new OrmSectionComment()
        comment.id = id
        comment.text = text
        comment.date = new Date()
        return comment
    }

}