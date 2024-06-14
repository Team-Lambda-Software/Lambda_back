import { Result } from "src/common/Application/result-handler/Result";
import { Entity } from "src/common/Domain/domain-object/entity.interface";

export class ProgressSection extends Entity<string>
{
    private sectionId:string;
    private isCompleted:boolean;
    private videoSecond:number; //Moment of the video that the user was at when the progress was saved
    private completionPercent:number; //Percentage of video that has been seen by user

    protected constructor (progressId:string, sectionId:string, isCompleted:boolean, videoSecond:number, completion:number)
    {
        super(progressId);
        this.sectionId = sectionId;
        this.isCompleted = isCompleted;
        this.videoSecond = videoSecond;
        this.completionPercent = completion;
    }

    //unused Redesign for common API does not consider standalone sections, thus, there is no need to save user data at the section level
        // get UserId():string
        // {
        //     return this.userId;
        // }

    get SectionId(): string
    {
        return this.sectionId;
    }

    get IsCompleted() : boolean
    {
        return this.isCompleted;
    }

    get VideoSecond() : number
    {
        return this.videoSecond;
    }

    get CompletionPercent() : number
    {
        return this.completionPercent;
    }

    //unused Sections now will have only a single video within. No need for this method. 11/jun
        // get Videos():ProgressVideo[]
        // {
        //     let videoArray:Array<ProgressVideo> = new Array<ProgressVideo>();
        //     for (let videoTuple of this.videos)
        //     {
        //         videoArray.push(videoTuple[1]);
        //     }
        //     return videoArray;
        // }

    static create (progressId:string, sectionId:string, isCompleted:boolean = false, videoSecond:number = 0, completionPercent:number = 0):ProgressSection
    {
        return new ProgressSection(progressId, sectionId, isCompleted, videoSecond, completionPercent);
    }

    public updateCompletion(isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    public updateVideoSecond(videoSecond:number)
    {
        this.videoSecond = videoSecond;
    }

    //to-do Dynamically update completion-percent whenever video-second progress is updated, via using section's duration
    public updateCompletionPercent(completionPercent:number)
    {
        this.completionPercent = completionPercent;
    }

    //unused Sections now contain a single video and are updated by themselves
        // public saveVideo(newVideo:ProgressVideo)
        // {
        //     this.videos.set(newVideo.VideoId, newVideo);
        // }

        // public updateVideoCompletionById(videoId:string, isCompleted:boolean):Result<ProgressVideo>
        // {
        //     let target:ProgressVideo = this.videos.get(videoId);
        //     if (target === undefined) // to--do Use Optional?
        //     {
        //         return Result.fail<ProgressVideo>(new Error('Video not found in Section'), 404, 'Video not found in Section');
        //     }
        //     target.updateCompletion(isCompleted);
        //     return Result.success<ProgressVideo>(target, 200);
        // }
}