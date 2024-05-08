import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmSection } from "src/course/infraestructure/entities/orm-entities/orm-section";

@Entity( {name:"progress_section"} )
export class OrmProgressSection
{
    @ManyToOne(() => OrmSection)
    @JoinColumn( {name: 'section_id', referencedColumnName: 'id'} )
    @PrimaryColumn( {type: "uuid"} )
    section_id:OrmSection;

    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    @PrimaryColumn( {type: "uuid"} )
    user_id:OrmUser;

    @Column('boolean') completed:boolean;
    @Column('numeric') completion_percent:number;

    static create (section:OrmSection, user:OrmUser, isCompleted:boolean, completionPercent:number): OrmProgressSection
    {
        const sectionProgress = new OrmProgressSection();
        sectionProgress.section_id = section;
        sectionProgress.user_id = user;
        sectionProgress.completed = isCompleted;
        sectionProgress.completion_percent = completionPercent;
        return sectionProgress;
    }
}