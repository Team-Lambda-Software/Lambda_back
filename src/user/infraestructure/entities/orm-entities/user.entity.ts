/* eslint-disable prettier/prettier */
import { OrmProgressCourse } from "src/progress/infraestructure/entities/orm-entities/orm-progress-course"
import { OrmProgressSection } from "src/progress/infraestructure/entities/orm-entities/orm-progress-section"
import { OrmProgressVideo } from "src/progress/infraestructure/entities/orm-entities/orm-progress-video"
import { OrmTrainer } from "src/trainer/infraestructure/entities/orm-entities/trainer.entity"
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm"



@Entity()
export class OrmUser
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar', { unique: true } ) email: string
    @Column( 'varchar' ) password: string
    @Column( 'varchar' ) first_name: string
    @Column( 'varchar' ) first_last_name: string
    @Column( 'varchar' ) second_last_name: string
    @Column( 'varchar', {unique: true, nullable:true}) phone: string
    @ManyToMany(() => OrmTrainer)
    @JoinTable({
        name: "follows",
        joinColumn: {
            name: "follower_id",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_user_follower_id"
        },
        inverseJoinColumn: {
            name: "trainer_id",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_trainer_id"
        },
    })
    trainers: OrmTrainer[];
    @OneToMany(() => OrmProgressCourse, (progressCourse) => progressCourse.user_id)
    progressCourse: OrmProgressCourse[]
    @OneToMany(() => OrmProgressSection, (progressSection) => progressSection.user_id)
    progressSection: OrmProgressSection[]
    @OneToMany(() => OrmProgressVideo, (progressVideo) => progressVideo.user_id)
    ProgressVideo: OrmProgressVideo[]

    //TODO all relations and fields for the stadistics, courses made, etc.

    static create ( id: string,
        email: string,
        password: string,
        phone: string,
        first_name: string,
        first_last_name: string,
        second_last_name: string,
        trainers?: OrmTrainer[],
        progressCourse?: OrmProgressCourse[],
        progressSection?: OrmProgressSection[],
        progressVideo?: OrmProgressVideo[]): OrmUser
    {
        const user = new OrmUser()
        user.id = id
        user.email = email
        user.password = password
        user.phone = phone
        user.first_name = first_name
        user.first_last_name = first_last_name
        user.second_last_name = second_last_name
        user.trainers = trainers
        user.progressCourse = progressCourse
        user.progressSection = progressSection
        user.ProgressVideo = progressVideo
        return user
    }


}