import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmSectionVideo } from "src/course/infraestructure/entities/orm-entities/orm-section-videos";

@Entity( {name:"progress_video"} )
export class OrmProgressVideo
{
    @ManyToOne(() => OrmSectionVideo)
    @JoinColumn( {name: 'video_id', referencedColumnName: 'id'} )
    @PrimaryColumn()
    video_id:OrmSectionVideo;

    @ManyToOne(() => OrmUser)
    @JoinColumn( {name: 'user_id', referencedColumnName: 'id'} )
    @PrimaryColumn()
    user_id:OrmUser;

    @Column('boolean') completed:boolean;
    @Column('number') playback_milisec:number;

    static create (video:OrmSectionVideo, user:OrmUser, isCompleted:boolean, playbackMilisec:number): OrmProgressVideo
    {
        const videoProgress = new OrmProgressVideo();
        videoProgress.video_id = video;
        videoProgress.user_id = user;
        videoProgress.completed = isCompleted;
        videoProgress.playback_milisec = playbackMilisec;
        return videoProgress;
    }
}