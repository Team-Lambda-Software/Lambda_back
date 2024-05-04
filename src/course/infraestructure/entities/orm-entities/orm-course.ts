import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import { OrmSection } from "./orm-section"
import { OrmSectionImage } from "./orm-section-images"



@Entity( { name: 'course' } )
export class OrmCourse
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) name: string
    @Column( 'varchar' ) description: string
    @Column( 'int' ) level: number
    @Column( 'int' ) weeks_duration: number
    @Column( 'int' ) minutes_per_section: number

    @OneToMany(()=> OrmSection, section => section.course)
    sections: OrmSection[]

    @OneToOne(()=> OrmSectionImage, image => image.course)
    image: OrmSectionImage

    //TODO relacion con trainer y con categoria
    @Column( { type: "uuid", nullable: true } ) trainer_id: string
    @Column( { type: "uuid", nullable: true } ) category_id: string

    static create ( id: string, name: string, description: string, level: number, weeks_duration: number, minutes_per_section: number ): OrmCourse
    {
        const course = new OrmCourse()
        course.id = id
        course.name = name
        course.description = description
        course.level = level
        course.weeks_duration = weeks_duration
        course.minutes_per_section = minutes_per_section
        return course
    }


}