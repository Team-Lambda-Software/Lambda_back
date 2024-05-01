import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { OrmSection } from "./orm-section"



@Entity( { name: 'section_video' } )
export class OrmSectionVideo
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) url: string

    //plantear esto como un many to many o un one to many? por ahora lo dejo como que un video solo puede estar en 1 seccion
    //en caso de colocar otro igual en otra seccion, se duplica el video en la base de datos(?

    @Column( { type: "uuid" } ) section_id: string
    @ManyToOne( () => OrmSection, { eager: true } ) @JoinColumn( { name: 'section_id' } ) section: OrmSection

    //TODO buscar la seccion dado el id para asignarselo a la entity
    static create ( id: string, url: string ): OrmSectionVideo
    {
        const video = new OrmSectionVideo()
        video.id = id
        video.url = url
        return video
    }

}