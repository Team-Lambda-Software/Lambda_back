import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, UpdateDateColumn, Unique } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmCourse } from "src/course/infraestructure/entities/orm-entities/orm-course";
import { last } from "rxjs";

@Unique(["course_id", "user_id"])
@Entity( {name:"progress_course"} )
export class OrmProgressCourse
{
    @PrimaryColumn( {type: "uuid"} )
    progress_id:string;

    @Column( {type: "uuid"} )
    course_id:string;
    @ManyToOne(() => OrmCourse)
    @JoinColumn( {name: 'course_id', referencedColumnName: 'id'} )
    course:OrmCourse;

    @Column( {type: "uuid"} )
    user_id:string;
    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    user:OrmUser;

    @Column('boolean') completed:boolean;
    @Column('numeric') completion_percent:number;
    @UpdateDateColumn() last_seen_date:Date;

    static create (progressId:string, courseId:string, userId:string, isCompleted:boolean, completionPercent:number): OrmProgressCourse
    {
        const courseProgress = new OrmProgressCourse();
        courseProgress.progress_id = progressId;
        courseProgress.course_id = courseId;
        courseProgress.user_id = userId;
        courseProgress.completed = isCompleted;
        courseProgress.completion_percent = completionPercent;
        return courseProgress;
    }
}