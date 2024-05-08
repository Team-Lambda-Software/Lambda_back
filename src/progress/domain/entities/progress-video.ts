import { Entity } from "src/common/Domain/domain-object/entity.interface";


export class ProgressVideo
{
    private videoId:string;
    private playbackMilisec:number;
    private isCompleted:boolean;

    protected constructor (videoId:string, playbackMilisec:number = 0, isCompleted:boolean = false)
    {
        this.videoId = videoId;
        this.playbackMilisec = playbackMilisec;
        this.isCompleted = isCompleted;
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

    static create (videoId:string, playbackMilisec:number, isCompleted:boolean)
    {
        return new ProgressVideo(videoId, playbackMilisec, isCompleted);
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