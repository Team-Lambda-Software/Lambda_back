import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { ProgressVideo } from "src/progress/domain/entities/progress-video";
import { SaveVideoProgressServiceEntryDto } from "../../dto/parameters/save-progress-video-entry.dto";

export class SaveVideoProgressApplicationService implements IApplicationService<SaveVideoProgressServiceEntryDto, ProgressVideo>
{
    private readonly progressRepository: IProgressCourseRepository;

    constructor ( progressRepository:IProgressCourseRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data: SaveVideoProgressServiceEntryDto): Promise<Result<ProgressVideo>>
    {
        const progressResult = await this.progressRepository.getVideoProgressById(data.userId, data.videoId);
        if (!progressResult.isSuccess())
        {
            return Result.fail<ProgressVideo>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
        }
        const progressUpdate:ProgressVideo = progressResult.Value;

        if (data.isCompleted != undefined) progressUpdate.updateCompletion(data.isCompleted);
        if (data.playbackMilisec) progressUpdate.updatePlaybackMilisec(data.playbackMilisec);
        
        const updateResult = await this.progressRepository.saveVideoProgress(progressUpdate);
        if (!updateResult.isSuccess())
        {
            return Result.fail<ProgressVideo>(updateResult.Error, updateResult.StatusCode, updateResult.Message);
        }
        return updateResult;
    }

    get name():string
    {
        return this.constructor.name;
    }
}