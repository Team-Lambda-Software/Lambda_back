import { Column, Entity, ManyToMany, PrimaryColumn, JoinTable, ManyToOne, OneToMany } from "typeorm"
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity"
import { OrmCourse } from "src/course/infraestructure/entities/orm-entities/orm-course";
import { OrmBlog } from "src/blog/infraestructure/entities/orm-entities/orm-blog";

@Entity( {name: 'trainer'} )
export class OrmTrainer
{
    @PrimaryColumn( {type: "uuid"} ) id:string;
    @Column('varchar') first_name:string;
    @Column('varchar') first_last_name:string;
    @Column('varchar') second_last_name:string;
    @Column('varchar', {unique: true} ) email:string;
    @Column('varchar', {unique: true, nullable: true} ) phone:string;
    @Column('varchar', {nullable:true} ) latitude:string; //to-do Remember to polish this
    @Column('varchar', {nullable:true} ) longitude:string;
    //to-do Relations for statistics and courses made

    //A trainer is followed by 'many' users
    @ManyToMany(() => OrmUser, {eager:true})
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
        },
    } )
    followers: OrmUser[];

    //A trainer may teach many courses, a course is teached by a single trainer
    @OneToMany(() => OrmCourse, (course) => course.trainer_id, {nullable: true})
    courses:OrmCourse[];

    //A trainer may write many blogs. A blog is written by a single trainer
    @OneToMany(() => OrmBlog, (blog) => blog.trainer_id, {nullable:true})
    blogs:OrmBlog[];

    static create (id:string, firstName:string, firstLastName:string, secondLastName:string, email:string, phone:string, latitude:string, longitude:string, followers:OrmUser[], courses:OrmCourse[], blogs:OrmBlog[]):OrmTrainer
    {
        const trainer = new OrmTrainer();
        trainer.id = id;
        trainer.first_name = firstName;
        trainer.first_last_name = firstLastName;
        trainer.second_last_name = secondLastName;
        trainer.email = email;
        trainer.phone = phone;
        trainer.latitude = latitude;
        trainer.longitude = longitude;
        trainer.followers = followers;
        trainer.courses = courses;
        trainer.blogs = blogs;
        return trainer;
    }
}