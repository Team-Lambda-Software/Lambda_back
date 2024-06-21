import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { SyncProgressCourseEntryDto } from "../../dto/parameters/sync-progress-course-entry.dto";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";

//!Think about the name, this needs to refer to a use case
//Syncs the course's completion-percent and is-completed with the data existent from its sections
export class SyncCourseProgressApplicationService implements IApplicationService<SyncProgressCourseEntryDto, ProgressCourse>
{
    private readonly progressRepository: IProgressCourseRepository;

    constructor ( progressRepository:IProgressCourseRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data:SyncProgressCourseEntryDto): Promise<Result<ProgressCourse>>
    {
        const progressResult = await this.progressRepository.getCourseProgressById(data.userId, data.courseId);
        if (!progressResult.isSuccess())
        {
            return Result.fail<ProgressCourse>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
        }
        const progress:ProgressCourse = progressResult.Value;

        //TEST Why is not updating?
            console.log("Syncing data . . .");
            console.log(progress.Sections);
            console.log(progress.CompletionPercent);

        if (progress.CompletionPercent === 100) { progress.updateCompletion(true); }

        const syncResult = await this.progressRepository.saveCourseProgress(progress);
        if (!syncResult.isSuccess())
        {
            return Result.fail<ProgressCourse>(syncResult.Error, syncResult.StatusCode, syncResult.Message);
        }
        return Result.success<ProgressCourse>(syncResult.Value, 200);
    }

    get name():string
    {
        return this.constructor.name;
    }
}