import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { SaveSectionProgressServiceEntryDto } from "../../dto/parameters/save-progress-section-entry.dto";

export class SaveSectionProgressApplicationService implements IApplicationService<SaveSectionProgressServiceEntryDto, ProgressSection>
{
    private readonly progressRepository: IProgressCourseRepository;

    constructor ( progressRepository:IProgressCourseRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data: SaveSectionProgressServiceEntryDto): Promise<Result<ProgressSection>>
    {
        //TEST
            console.log("Getting previous progress...");
        const progressResult = await this.progressRepository.getSectionProgressById(data.userId, data.sectionId);
        //TEST
            console.log("Progress obtained!");
        if (!progressResult.isSuccess())
        {
            return Result.fail<ProgressSection>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
        }
        const progressUpdate:ProgressSection = progressResult.Value;

        if (data.isCompleted != undefined) 
        { 
            progressUpdate.updateCompletion(data.isCompleted); 
            if (data.isCompleted)
            {
                progressUpdate.updateCompletionPercent(100);
            }
        }
        if (data.videoSecond != undefined) { progressUpdate.updateVideoSecond(data.videoSecond); } //to-do Sync completionPercent after updating video progress

        //unused Sections now only have a single video, thus, its metadata can be saved within
            // if (data.videos) 
            // {
            //     for (let videoTuple of data.videos)
            //     {
            //         const videoAttributes = videoTuple[1];
            //         const video:ProgressVideo = ProgressVideo.create(videoAttributes.userId, videoAttributes.videoId, videoAttributes.playbackMilisec, videoAttributes.isCompleted);
                    
            //         let videoSaveDto:SaveVideoProgressServiceEntryDto = {userId: data.userId, videoId:video.VideoId, isCompleted: video.IsCompleted, playbackMilisec: video.PlaybackMilisec};
                    
            //         progressUpdate.saveVideo(video);

            //         let videoResult:Result<ProgressVideo> = await this.saveVideoService.execute(videoSaveDto); //When saving a section, cascade-save all progress of videos within
            //         if (!videoResult.isSuccess()) //If video could not be saved, abort section saving
            //         {
            //             return Result.fail<ProgressSection>(videoResult.Error, videoResult.StatusCode, videoResult.Message);
            //         }
            //     }
            // }

        const updateResult = await this.progressRepository.saveSectionProgress(progressUpdate, data.userId);
        if (!updateResult.isSuccess())
        {
            return Result.fail<ProgressSection>(updateResult.Error, updateResult.StatusCode, updateResult.Message);
        }
        return Result.success<ProgressSection>(updateResult.Value, 200);
    }

    get name():string
    {
        return this.constructor.name;
    }
}