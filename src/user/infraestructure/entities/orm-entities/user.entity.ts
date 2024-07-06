/* eslint-disable prettier/prettier */
import { OrmProgressCourse } from "src/progress/infraestructure/entities/orm-entities/orm-progress-course"
import { OrmProgressSection } from "src/progress/infraestructure/entities/orm-entities/orm-progress-section"
import { OrmTrainer } from "src/trainer/infraestructure/entities/orm-entities/trainer.entity"
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm"
import { EnumInfraUserRoles } from "../../user-roles/enum-infra-user-roles"

@Entity()
export class OrmUser {

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar', { unique: true } ) email: string
    @Column( 'varchar' ) password: string
    @Column( 'varchar', { default: 'name-default' } ) name: string
    @Column( 'varchar', { nullable: true } ) image: string
    @Column( 'varchar', {unique: true, nullable:false}) phone: string
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

    @Column( 'enum', { enum: EnumInfraUserRoles, default: 'CLIENT' } )
    type: string
    
    //TODO all relations and fields for the stadistics, courses made, etc.

    static create ( 
        id: string,
        name: string,
        phone: string,
        email: string,
        image?: string,
        password?: string,
        type?: string,
        trainers?: OrmTrainer[],
        progressCourse?: OrmProgressCourse[],
        progressSection?: OrmProgressSection[],
    ): OrmUser
    {
        const user = new OrmUser()
        user.id = id
        user.email = email
        user.password = password
        user.phone = phone
        user.type = type
        user.name = name
        user.image = image
        user.trainers = trainers
        user.progressCourse = progressCourse
        user.progressSection = progressSection
        return user
    }


}