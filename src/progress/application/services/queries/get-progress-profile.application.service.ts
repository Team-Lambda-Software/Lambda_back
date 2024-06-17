import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { GetProgressProfileResponseDto } from "../../dto/responses/get-progress-profile-response.dto";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";


export class GetProgressProfileApplicationService implements IApplicationService<ApplicationServiceEntryDto, GetProgressProfileResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;

    constructor ( progressRepository:IProgressCourseRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data:ApplicationServiceEntryDto): Promise<Result<GetProgressProfileResponseDto>>
    {
        const latestProgressResult = await this.progressRepository.findLatestCourse(data.userId);
        if (!latestProgressResult.isSuccess())
        {
            return Result.fail<GetProgressProfileResponseDto>(latestProgressResult.Error, latestProgressResult.StatusCode, latestProgressResult.Message);
        }
        const latestProgress = (latestProgressResult.Value).course;

        const totalViewtimeResult = await this.progressRepository.getTotalViewtime(data.userId);
        if (!totalViewtimeResult.isSuccess())
        {
            return Result.fail<GetProgressProfileResponseDto>(totalViewtimeResult.Error, totalViewtimeResult.StatusCode, totalViewtimeResult.Message);
        }
        const totalViewtimeInHours = (totalViewtimeResult.Value) / 3600;

        const returnData = {latestCompletionPercent: latestProgress.CompletionPercent, totalViewtimeInHours: totalViewtimeInHours};
        return Result.success<GetProgressProfileResponseDto>( returnData, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}