import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer";
import { ProgressQueryRepository } from "../repositories/progress-query-repository.interface";
import { OdmProgressEntity } from "../entities/odm-entities/odm-progress.entity";
import { Result } from "src/common/Domain/result-handler/Result";
import { CourseCompleted } from "src/progress/domain/events/course-completed-event";

export class CourseCompletedQuerySynchronizer implements Querysynchronizer<CourseCompleted>
{
    private readonly progressRepository: ProgressQueryRepository;
    constructor ( progressRepository:ProgressQueryRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(event: CourseCompleted): Promise<Result<string>> 
    {
        const progressResult = await this.progressRepository.findProgressByCourseId(event.courseId, event.userId);
        if (!progressResult.isSuccess())
        {
            return Result.fail<string>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
        }
        let progress:OdmProgressEntity = progressResult.Value;

        progress.completed = true;
        const errors = progress.validateSync();
        if (errors) {
            return Result.fail<string>( errors, 400, errors.name )
        }

        try
        {
            await this.progressRepository.updateProgress(progress);
        }
        catch (error)
        {
            return Result.fail<string>(error, 500, error.message);
        }

        return Result.success<string>( 'Success', 201 );
    }
}