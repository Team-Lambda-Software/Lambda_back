import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm"
import { OrmSection } from "./orm-section"
import { OrmCourse } from "./orm-course"



@Entity( { name: 'section_image' } )
export class OrmSectionImage
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) url: string

    //plantear esto como un many to many o un one to many? por ahora lo dejo como que una imagen solo puede estar en 1 seccion
    //en caso de colocar otro igual en otra seccion, se duplica la imagen en la base de datos(?
    @Column( { type: "uuid", nullable: true } ) section_id: string
    @ManyToOne( () => OrmSection ) @JoinColumn( { name: 'section_id' } ) section: OrmSection

    @Column( { type: "uuid", nullable: true } ) course_id: string
    @OneToOne( () => OrmCourse ) @JoinColumn( { name: 'course_id' } ) course: OrmCourse

    //TODO buscar la seccion dado el id para asignarselo a la entity
    //TODO buscar el curso dado el id para asignarselo a la entity
    static create ( id: string, url: string ): OrmSectionImage
    {
        const video = new OrmSectionImage()
        video.id = id
        video.url = url
        return video
    }

}