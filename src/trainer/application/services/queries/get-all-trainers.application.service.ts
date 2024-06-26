import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { GetManyTrainersServiceEntryDto } from "../../dto/parameters/get-many-trainers-service-entry.dto";
import { GetManyTrainersServiceResponseDto } from "../../dto/responses/get-many-trainers-service-response.dto";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { TrainerName } from "src/trainer/domain/value-objects/trainer-name";
import { TrainerLocation } from "src/trainer/domain/value-objects/trainer-location";
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers";
import { UserId } from "src/user/domain/value-objects/user-id";

export class GetAllTrainersApplicationService implements IApplicationService<GetManyTrainersServiceEntryDto, GetManyTrainersServiceResponseDto>
{
    private readonly trainerRepository: ITrainerRepository;

    constructor (trainerRepository: ITrainerRepository)
    {
        this.trainerRepository = trainerRepository;
    }
    
    async execute(data: GetManyTrainersServiceEntryDto): Promise<Result<GetManyTrainersServiceResponseDto>> {
        const trainersResult = await this.trainerRepository.findAllTrainers(data.pagination);
        if (!trainersResult.isSuccess())
        {
            return Result.fail<GetManyTrainersServiceResponseDto>(trainersResult.Error, trainersResult.StatusCode, trainersResult.Message);
        }
        const trainers = trainersResult.Value;
        //TEST
            console.log("Trainers searched.");
            console.log(trainers);

        let trainersResponse:GetManyTrainersServiceResponseDto = {trainers: []};
        for (const trainer of trainers)
        {
            //TEST
                console.log("Foreach cycle started");
            const trainerId = trainer.Id.Value;

            const trainerNameVO:TrainerName = trainer.Name;
            const trainerName:string = trainerNameVO.FirstName + " " + trainerNameVO.FirstLastName + " " + trainerNameVO.SecondLastName;

            let trainerLocation:string = "no disponible";
            let locationVO: TrainerLocation = trainer.Location;
            if (locationVO)
            {
                trainerLocation = trainer.Location.Latitude + ", " + trainer.Location.Longitude;
            }

            const resultCount = await this.trainerRepository.getFollowerCount(trainer.Id.Value);
            if (!resultCount.isSuccess())
            {
                return Result.fail<GetManyTrainersServiceResponseDto>( resultCount.Error, resultCount.StatusCode, resultCount.Message );
            }
            const followerCount = resultCount.Value;

            const trainerFollowers:TrainerFollowers = trainer.FollowersID;
            const userId:UserId = UserId.create(data.userId);
            let doesUserFollow:boolean = false;
            for (let follower of trainerFollowers.Value)
            {
                if (follower.equals(userId))
                {
                    doesUserFollow = true;
                    break;
                }
            }

            const trainerResponse = {
                id: trainerId,
                name: trainerName,
                location: trainerLocation,
                followerCount: followerCount,
                doesUserFollow: doesUserFollow
            }
            //TEST
                console.log("Constructed response...");
                console.log(trainerResponse);
            trainersResponse.trainers.push(trainerResponse);
        }

        return Result.success<GetManyTrainersServiceResponseDto>( trainersResponse, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}