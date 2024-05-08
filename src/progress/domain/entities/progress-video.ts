import { Entity } from "src/common/Domain/domain-object/entity.interface";


export class ProgressVideo
{
    private userId:string;
    private videoId:string;
    private playbackMilisec:number;
    private isCompleted:boolean;

    protected constructor (userId:string, videoId:string, playbackMilisec:number = 0, isCompleted:boolean = false)
    {
        this.userId = userId;
        this.videoId = videoId;
        this.playbackMilisec = playbackMilisec;
        this.isCompleted = isCompleted;
    }

    get UserId():string
    {
        return this.userId;
    }

    get VideoId():string
    {
        return this.videoId;
    }

    get PlaybackMilisec():number
    {
        return this.playbackMilisec;
    }

    get IsCompleted():boolean
    {
        return this.isCompleted;
    }

    static create (userId:string, videoId:string, playbackMilisec:number, isCompleted:boolean)
    {
        return new ProgressVideo(userId, videoId, playbackMilisec, isCompleted);
    }

    public updateCompletion(isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    public updatePlaybackMilisec(playbackMilisec:number)
    {
        this.playbackMilisec = playbackMilisec;
    }
}