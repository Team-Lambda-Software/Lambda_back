/* eslint-disable prettier/prettier */
import { OrmTrainer } from "src/trainer/infraestructure/entities/orm-entities/trainer.entity"
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"



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

    //TODO all relations and fields for the stadistics, courses made, etc.

    static create ( id: string,
        email: string,
        password: string,
        phone: string,
        first_name: string,
        first_last_name: string,
        second_last_name: string,
        trainers: OrmTrainer[] = []): OrmUser
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
        return user
    }


}