import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmSection } from "src/course/infraestructure/entities/orm-entities/orm-section";

@Entity( {name:"progress_section"} )
export class OrmProgressSection
{
    @PrimaryColumn( {type: "uuid"} )
    progress_id:string;

    @Column( {type: "uuid"} )
    section_id:string;
    @ManyToOne(() => OrmSection)
    @JoinColumn( {name: 'section_id', referencedColumnName: 'id'} )
    section:OrmSection;

    @Column('boolean') completed:boolean;
    @Column('numeric') completion_percent:number;
    @Column('numeric') video_second:number;

    //* Even though the user is not referenced within the domain's sections, it was kept here to simplify DB queries
    @Column( {type: "uuid"} )
    user_id:string;
    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    user:OrmUser;

    static create (progressId:string, sectionId:string, isCompleted:boolean, videoSecond:number, completionPercent:number): OrmProgressSection
    {
        const sectionProgress = new OrmProgressSection();
        sectionProgress.progress_id = progressId;
        sectionProgress.section_id = sectionId;
        sectionProgress.completed = isCompleted;
        sectionProgress.video_second = videoSecond;
        sectionProgress.completion_percent = completionPercent;
        return sectionProgress;
    }
}