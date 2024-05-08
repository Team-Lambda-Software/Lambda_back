import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmCourse } from "src/course/infraestructure/entities/orm-entities/orm-course";

@Entity( {name:"progress_course"} )
export class OrmProgressCourse
{
    @ManyToOne(() => OrmCourse)
    @JoinColumn( {name: 'course_id', referencedColumnName: 'id'} )
    @PrimaryColumn()
    course_id:OrmCourse;

    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    @PrimaryColumn()
    user_id:OrmUser;

    @Column('boolean') completed:boolean;
    @Column('number') completion_percent:number;

    static create (course:OrmCourse, user:OrmUser, isCompleted:boolean, completionPercent:number): OrmProgressCourse
    {
        const courseProgress = new OrmProgressCourse();
        courseProgress.course_id = course;
        courseProgress.user_id = user;
        courseProgress.completed = isCompleted;
        courseProgress.completion_percent = completionPercent;
        return courseProgress;
    }
}