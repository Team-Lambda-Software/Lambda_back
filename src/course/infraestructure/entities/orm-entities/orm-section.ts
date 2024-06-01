import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmCourse } from "./orm-course"
import { OrmSectionImage } from "./orm-section-images"
import { OrmSectionVideo } from "./orm-section-videos"
import { OrmSectionComment } from "./orm-section-comment"
import { OrmProgressSection } from "src/progress/infraestructure/entities/orm-entities/orm-progress-section"



@Entity( { name: 'section' } )
export class OrmSection
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) name: string
    @Column( 'varchar' ) description: string
    @Column( 'varchar', { nullable: true } ) text: string
    @Column( 'float', {default: 1000}) duration: number
    @Column( { type: "uuid" } ) course_id: string
    @ManyToOne( () => OrmCourse, { eager: true, nullable: true } ) @JoinColumn( { name: 'course_id' } ) course: OrmCourse

    @OneToOne(()=> OrmSectionImage, image => image.section, { eager: true })
    image: OrmSectionImage

    @OneToOne(()=> OrmSectionVideo, video => video.section, { eager: true })
    video: OrmSectionVideo

    @OneToMany(()=> OrmSectionComment, comment => comment.section)
    comments: OrmSectionComment[]

    @OneToMany(()=> OrmProgressSection, progressSection => progressSection.section_id)
    progress: OrmProgressSection[]

    //TODO buscar el curso dado el id para asignarselo a la entity
    static create ( id: string, name: string, description: string, duration:number ,text?: string): OrmSection
    {
        const section = new OrmSection()
        section.id = id
        section.name = name
        section.description = description
        section.text = text
        section.duration = duration
        return section
    }

}