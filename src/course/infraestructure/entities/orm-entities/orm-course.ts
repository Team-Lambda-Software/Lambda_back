import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { OrmSection } from "./orm-section"
import { OrmTrainer } from '../../../../trainer/infraestructure/entities/orm-entities/trainer.entity';
import { OrmCategory } from "src/categories/infraesctructure/entities/orm-entities/orm-category"
import { OrmCourseTags } from "./orm-course-tags"
import { OrmProgressCourse } from "src/progress/infraestructure/entities/orm-entities/orm-progress-course"



@Entity( { name: 'course' } )
export class OrmCourse
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) name: string
    @Column( 'varchar' ) description: string
    @Column( 'int' ) level: number
    @Column( 'int' ) weeks_duration: number
    @Column( 'int' ) minutes_per_section: number
    @Column( 'timestamp', { default: () => 'CURRENT_TIMESTAMP' } ) date: Date
    @Column( 'varchar', {nullable: true} ) image_url: string
    @OneToMany(()=> OrmSection, section => section.course)
    sections: OrmSection[]


    //TODO relacion con trainer y con categoria
    @Column( { type: "uuid"} ) trainer_id: string
    @ManyToOne( () => OrmTrainer, trainer => trainer.courses, {eager: true}) @JoinColumn({ name: 'trainer_id'}) trainer: OrmTrainer

    @Column( { type: "uuid"} ) category_id: string
    @ManyToOne( () => OrmCategory, category => category.courses ) @JoinColumn({ name: 'category_id'}) category: OrmCategory

    @OneToMany(()=> OrmProgressCourse, progressCourse => progressCourse.course_id)
    progress: OrmProgressCourse[]

    @ManyToMany(()=>OrmCourseTags, {eager:true})
    @JoinTable({
        name: "c_t",
        joinColumn: {
            name: "course_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "tag_name",
            referencedColumnName: "name"
        }
    })
    tags: OrmCourseTags[]

    static create ( id: string, name: string, description: string, level: number, weeks_duration: number, minutes_per_section: number, trainerId: string, categoryId: string, image: string ,tags: OrmCourseTags[]): OrmCourse
    {
        const course = new OrmCourse()
        course.id = id
        course.name = name
        course.description = description
        course.level = level
        course.weeks_duration = weeks_duration
        course.minutes_per_section = minutes_per_section
        course.trainer_id = trainerId
        course.category_id = categoryId
        course.tags = tags
        course.image_url = image
        return course
    }


}