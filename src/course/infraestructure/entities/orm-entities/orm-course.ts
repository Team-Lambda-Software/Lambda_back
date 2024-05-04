import { Column, Entity, PrimaryColumn } from "typeorm"



@Entity( { name: 'course' } )
export class OrmCourse
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) name: string
    @Column( 'varchar' ) description: string
    @Column( 'int' ) level: number
    @Column( 'int' ) weeks_duration: number
    @Column( 'int' ) minutes_per_section: number

    //TODO relacion con trainer y con categoria

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