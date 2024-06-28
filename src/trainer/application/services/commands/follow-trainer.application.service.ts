import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { TogggleTrainerFollowServiceEntryDto } from "../../dto/parameters/toggle-trainer-follow-service-entry.dto";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers";
import { UserId } from "src/user/domain/value-objects/user-id";
import { Trainer } from "src/trainer/domain/trainer";
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { CannotFollowTrainerException } from "src/trainer/domain/exceptions/cannot-follow-trainer";
import { ToggleTrainerFollowServiceResponseDto } from "../../dto/responses/toggle-trainer-follow-service-response.dto";

export class FollowTrainerApplicationService implements IApplicationService<TogggleTrainerFollowServiceEntryDto, ToggleTrainerFollowServiceResponseDto> {
    private readonly trainerRepository: ITrainerRepository;
    private readonly eventHandler: IEventHandler;

    constructor (trainerRepository: ITrainerRepository, eventHandler: IEventHandler)
    {
        this.trainerRepository = trainerRepository;
        this.eventHandler = eventHandler;
    }
    
    async execute(data: TogggleTrainerFollowServiceEntryDto): Promise<Result<ToggleTrainerFollowServiceResponseDto>> {
        //TEST
            console.log("service execution started");
        let isIncluded:boolean = false;
        const trainerValue = data.trainer;
        let trainerFollowers:TrainerFollowers = trainerValue.FollowersID;
        let userId:UserId = UserId.create(data.userId);
        let trainerId:TrainerId = trainerValue.Id;

        for (let follower of trainerFollowers.Value)
        {
            if (follower.equals(userId))
            {
                isIncluded = true;
                break;
            }
        }
        //TEST
            console.log("Follow check done.", isIncluded);

        let toggleResult:Result<string>;
        if (isIncluded)
        {
            return Result.fail<ToggleTrainerFollowServiceResponseDto>(new Error("El usuario ya se encuentra siguiendo al entrenador. No puede seguirlo nuevamente"), 409, "El usuario ya se encuentra siguiendo al entrenador. No puede seguirlo nuevamente");
        }
        else
        {
            toggleResult = trainerValue.addFollower(userId);
        }
        //TEST
            console.log("Domain toggle finished.", toggleResult);
        if (!toggleResult.isSuccess())
        {
            return Result.fail<ToggleTrainerFollowServiceResponseDto>(toggleResult.Error, toggleResult.StatusCode, toggleResult.Message);
        }
        //TEST
            console.log("Domain toggle success");

        const persistenceUpdateResult = await this.trainerRepository.followTrainer(trainerId.Value, userId.Id);
        if (!persistenceUpdateResult.isSuccess())
        {
            return Result.fail<ToggleTrainerFollowServiceResponseDto>( persistenceUpdateResult.Error, persistenceUpdateResult.StatusCode, persistenceUpdateResult.Message );
        }
        //TEST
            console.log("Persistence toggle success");
        await this.eventHandler.publish( trainerValue.pullEvents() );
        //TEST
            console.log("service execution success");
        return Result.success<ToggleTrainerFollowServiceResponseDto>( {message: "Suscrito exitosamente"}, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}