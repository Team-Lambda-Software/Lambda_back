import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer";
import { UserHasProgressed } from "src/progress/domain/events/user-has-progressed-event";
import { ProgressQueryRepository } from "../repositories/progress-query-repository.interface";
import { OdmProgressEntity } from "../entities/odm-entities/odm-progress.entity";
import { Result } from "src/common/Domain/result-handler/Result";

export class SaveProgressQuerySynchronizer implements Querysynchronizer<UserHasProgressed>
{
    private readonly progressRepository: ProgressQueryRepository;
    
    constructor ( progressRepository:ProgressQueryRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(event: UserHasProgressed): Promise<Result<string>> 
    {
        //TEST
            //console.log("Entered synchronizer");
        const progressResult = await this.progressRepository.findProgressByCourseId(event.courseId, event.userId);
        if (!progressResult.isSuccess())
        {
            return Result.fail<string>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
        }
        let progress:OdmProgressEntity = progressResult.Value;
        //TEST
            //console.log("Obtained...");
            //console.log(progress);

        let sum:number = 0;
        for (let section of progress.section_progress)
        {
            if (section.section_id === event.sectionId)
            {
                section.completion_percent = event.percentage;
                section.video_second = event.seconds;
            }
            sum += section.completion_percent;
        }
        progress.completion_percent = (sum / progress.section_progress.length);
        
        const errors = progress.validateSync();
        if (errors) {
            return Result.fail<string>( errors, 400, errors.name )
        }

        try
        {
            //TEST
                //console.log("Trying to save...",progress);
            await this.progressRepository.updateProgress(progress);
            //TEST
                //console.log("Saved!");
        }
        catch (error)
        {
            return Result.fail<string>(error, 500, error.message);
        }

        return Result.success<string>( 'Success', 201 );
    }
}