import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { GetUserFollowingCountServiceResponseDto } from "../../dto/responses/get-user-following-count-service-response.dto";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";

export class GetUserFollowingCountApplicationService implements IApplicationService<ApplicationServiceEntryDto, GetUserFollowingCountServiceResponseDto>
{
    private readonly trainerRepository: ITrainerRepository;

    constructor(trainerRepository: ITrainerRepository)
    {
        this.trainerRepository = trainerRepository;
    }

    async execute(data: ApplicationServiceEntryDto): Promise<Result<GetUserFollowingCountServiceResponseDto>> {
        const followingCountResult = await this.trainerRepository.getUserFollowingCount(data.userId);
        if (!followingCountResult.isSuccess())
        {
            return Result.fail<GetUserFollowingCountServiceResponseDto>(followingCountResult.Error, followingCountResult.StatusCode, followingCountResult.Message);
        }
        const responseCount:GetUserFollowingCountServiceResponseDto = {count: followingCountResult.Value};

        return Result.success<GetUserFollowingCountServiceResponseDto>( responseCount, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}