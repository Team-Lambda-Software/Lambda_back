import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
// import { OrmSectionVideo } from "src/course/infraestructure/entities/orm-entities/orm-section-videos";

@Entity( {name:"progress_video"} )
export class OrmProgressVideo
{
    @PrimaryColumn( {type: "uuid"} )
    video_id:string;
    // @ManyToOne(() => OrmSectionVideo)
    // @JoinColumn( {name: 'video_id', referencedColumnName: 'id'} )
    // video:OrmSectionVideo;

    @PrimaryColumn( {type: "uuid"} )
    user_id:string;
    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    user:OrmUser;

    @Column('boolean') completed:boolean;
    @Column('numeric') playback_milisec:number;

    //? Does this work without having the reference to the entity? Note. Same doubt on orm-progress-section and orm-progress-course
    static create (videoId:string, userId:string, isCompleted:boolean, playbackMilisec:number): OrmProgressVideo
    {
        const videoProgress = new OrmProgressVideo();
        videoProgress.video_id = videoId;
        videoProgress.user_id = userId;
        videoProgress.completed = isCompleted;
        videoProgress.playback_milisec = playbackMilisec;
        return videoProgress;
    }
}