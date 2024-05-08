import { Entity } from "src/common/Domain/domain-object/entity.interface";


export class ProgressVideo
{
    private videoId:string;
    private playbackSecond:number;
    private isCompleted:boolean;

    protected constructor (videoId:string, playbackSecond:number = 0, isCompleted:boolean = false)
    {
        this.videoId = videoId;
        this.playbackSecond = playbackSecond;
        this.isCompleted = isCompleted;
    }

    get VideoId():string
    {
        return this.videoId;
    }

    get PlaybackSecond():number
    {
        return this.playbackSecond;
    }

    get IsCompleted():boolean
    {
        return this.isCompleted;
    }

    static create (videoId:string, playbackSecond:number, isCompleted:boolean)
    {
        return new ProgressVideo(videoId, playbackSecond, isCompleted);
    }

    public updateCompletion(isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    public updatePlaybackSecond(playbackSecond:number)
    {
        this.playbackSecond = playbackSecond;
    }
}