import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { OrmSection } from "./orm-section"
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity"



@Entity( { name: 'section_comment' } )
export class OrmSectionComment
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) text: string
    @Column( 'timestamp' ) date: Date

    @Column( { type: "uuid" } ) section_id: string
    @ManyToOne( () => OrmSection, { eager: true } ) @JoinColumn( { name: 'section_id' } ) section: OrmSection
    
    @Column( { type: "uuid" } ) user_id: string
    @ManyToOne(()=> OrmUser , { eager: true }) @JoinColumn( { name: 'user_id' } ) user: OrmUser

    //TODO buscar la seccion dado el id para asignarselo a la entity
    static create ( id: string, text: string, userId: string, sectionId:string, date: Date): OrmSectionComment
    {
        const comment = new OrmSectionComment()
        comment.id = id
        comment.text = text
        comment.section_id = sectionId
        comment.user_id = userId
        comment.date = date
        return comment
    }

}