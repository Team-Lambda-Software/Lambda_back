import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmSection } from "src/course/infraestructure/entities/orm-entities/orm-section";

@Entity( {name:"progress_section"} )
export class OrmProgressSection
{

    @PrimaryColumn( {type: "uuid"} )
    section_id:string;
    @ManyToOne(() => OrmSection)
    @JoinColumn( {name: 'section_id', referencedColumnName: 'id'} )
    section:OrmSection;

    @PrimaryColumn( {type: "uuid"} )
    user_id:string;
    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    user:OrmUser;

    @Column('boolean') completed:boolean;
    @Column('numeric') completion_percent:number;

    static create (sectionId:string, userId:string, isCompleted:boolean, completionPercent:number): OrmProgressSection
    {
        const sectionProgress = new OrmProgressSection();
        sectionProgress.section_id = sectionId;
        sectionProgress.user_id = userId;
        sectionProgress.completed = isCompleted;
        sectionProgress.completion_percent = completionPercent;
        return sectionProgress;
    }
}