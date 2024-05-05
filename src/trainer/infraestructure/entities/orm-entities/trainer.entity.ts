import { Column, Entity, ManyToMany, PrimaryColumn, JoinTable } from "typeorm"
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity"

@Entity( {name: 'trainer'} )
export class OrmTrainer
{
    @PrimaryColumn( {type: "uuid"} ) id:string;
    @Column('varchar') first_name:string;
    @Column('varchar') first_last_name:string;
    @Column('varchar') second_last_name:string;
    @Column('varchar', {unique: true} ) email:string;
    @Column('varchar', {unique: true, nullable: true} ) phone:string;
    @Column('varchar', {nullable:true} ) location:string; //to-do Remember to polish this
    //to-do Relations for statistics and courses made

    @ManyToMany(() => OrmUser)
    @JoinTable({
        name:"follows",
        joinColumn: {
            name: "trainer_id",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_trainer_id"
        },
        inverseJoinColumn: {
            name: "follower_id",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_user_follower_id"
        }
    } )
    followers: OrmUser[];

    static create (id:string, firstName:string, firstLastName:string, secondLastName:string, email:string, phone:string, location:string, followers:OrmUser[]):OrmTrainer
    {
        const trainer = new OrmTrainer();
        trainer.id = id;
        trainer.first_name = firstName;
        trainer.first_last_name = firstLastName;
        trainer.second_last_name = secondLastName;
        trainer.email = email;
        trainer.phone = phone;
        trainer.location = location;
        trainer.followers = followers;
        return trainer;
    }
}