/* eslint-disable prettier/prettier */
import { OrmProgressCourse } from "src/progress/infraestructure/entities/orm-entities/orm-progress-course"
import { OrmProgressSection } from "src/progress/infraestructure/entities/orm-entities/orm-progress-section"
import { OrmProgressVideo } from "src/progress/infraestructure/entities/orm-entities/orm-progress-video"
import { OrmTrainer } from "src/trainer/infraestructure/entities/orm-entities/trainer.entity"
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm"
import { EnumInfraUserRoles } from "../../user-roles/enum-infra-user-roles"
import { OrmNotificationAddress } from "src/notification/infraestructure/entities/orm-entities/orm-notification-address"
import { OrmNotificationAlert } from "src/notification/infraestructure/entities/orm-entities/orm-notification-alert"

@Entity()
export class OrmUser {

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar', { unique: true } ) email: string
    @Column( 'varchar' ) password: string
    @Column( 'varchar', { default: 'name-default' } ) name: string
    @Column( 'varchar', { nullable: true } ) image: string
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

    @Column( 'enum', { enum: EnumInfraUserRoles, default: 'CLIENT' } )
    type: string
    
    @OneToMany(() => OrmNotificationAddress, (notification) => notification.user_id)
    notificationsAddress: OrmNotificationAddress[]
    @OneToMany(() => OrmNotificationAlert, (notification) => notification.user_id)
    notificationsReceived: OrmNotificationAlert[] 
    
    //TODO all relations and fields for the stadistics, courses made, etc.

    static create ( 
        id: string,
        phone: string,
        name: string,
        image?: string,
        email?: string,
        password?: string,
        type?: string,
        trainers?: OrmTrainer[],
        progressCourse?: OrmProgressCourse[],
        progressSection?: OrmProgressSection[],
        progressVideo?: OrmProgressVideo[],
        notificationsAddress?: OrmNotificationAddress[],
        notificationsReceived?: OrmNotificationAlert[]
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
        user.ProgressVideo = progressVideo
        user.notificationsReceived = notificationsReceived
        user.notificationsAddress = notificationsAddress
        return user
    }


}