import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmCourse } from "src/course/infraestructure/entities/orm-entities/orm-course";

@Entity( {name:"progress_course"} )
export class OrmProgressCourse
{
    @PrimaryColumn( {type: "uuid"} )
    course_id:string;
    @ManyToOne(() => OrmCourse)
    @JoinColumn( {name: 'course_id', referencedColumnName: 'id'} )
    course:OrmCourse;

    @PrimaryColumn( {type: "uuid"} )
    user_id:string;
    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    user:OrmUser;

    @Column('boolean') completed:boolean;
    @Column('numeric') completion_percent:number;

    static create (courseId:string, userId:string, isCompleted:boolean, completionPercent:number): OrmProgressCourse
    {
        const courseProgress = new OrmProgressCourse();
        courseProgress.course_id = courseId;
        courseProgress.user_id = userId;
        courseProgress.completed = isCompleted;
        courseProgress.completion_percent = completionPercent;
        return courseProgress;
    }
}