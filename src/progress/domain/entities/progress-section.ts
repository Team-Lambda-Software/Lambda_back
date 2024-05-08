import { Result } from "src/common/Application/result-handler/Result";
import { ProgressVideo } from "./progress-video";

export class ProgressSection
{
    private userId:string;
    private sectionId:string;
    private isCompleted:boolean;
    private videos: Map<string, ProgressVideo> = new Map<string,ProgressVideo>();

    protected constructor (userId:string, sectionId:string, isCompleted:boolean, videos?:ProgressVideo[])
    {
        this.userId = userId;
        this.sectionId = sectionId;
        this.isCompleted = isCompleted;
        if (videos != undefined)
        {
            for (let video of videos)
            {
                this.videos.set(video.VideoId, video);
            }
        }
    }

    get UserId():string
    {
        return this.userId;
    }

    get SectionId(): string
    {
        return this.sectionId;
    }

    get IsCompleted() : boolean
    {
        return this.isCompleted;
    }

    //Section completion equals to percentage of completed videos
    get CompletionPercent(): number
    {
        if (this.IsCompleted)
        {
            return 100;
        }
        if (this.videos.size === 0)
        {
            return 0;
        }
        let completeVideos = 0;
        for (let videoTuple of this.videos)
        {
            if (videoTuple[1].IsCompleted)
            {
                completeVideos += 1;
            }
        }
        return ( (completeVideos/this.videos.size)*100 );
    }

    get Videos():ProgressVideo[]
    {
        let videoArray:Array<ProgressVideo> = new Array<ProgressVideo>();
        for (let videoTuple of this.videos)
        {
            videoArray.push(videoTuple[1]);
        }
        return videoArray;
    }

    static create (userId:string, sectionId:string, isCompleted:boolean, videos?:ProgressVideo[]):ProgressSection
    {
        return new ProgressSection(userId, sectionId, isCompleted, videos);
    }

    public updateCompletion(isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    public saveVideo(newVideo:ProgressVideo)
    {
        this.videos.set(newVideo.VideoId, newVideo);
    }

    public updateVideoCompletionById(videoId:string, isCompleted:boolean):Result<ProgressVideo>
    {
        let target:ProgressVideo = this.videos.get(videoId);
        if (target === undefined) //to-do Use Optional?
        {
            return Result.fail<ProgressVideo>(new Error('Video not found in Section'), 404, 'Video not found in Section');
        }
        target.updateCompletion(isCompleted);
        return Result.success<ProgressVideo>(target, 200);
    }
}