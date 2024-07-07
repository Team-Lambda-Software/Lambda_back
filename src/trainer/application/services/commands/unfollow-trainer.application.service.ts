import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { TogggleTrainerFollowServiceEntryDto } from "../../dto/parameters/toggle-trainer-follow-service-entry.dto";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers";
import { UserId } from "src/user/domain/value-objects/user-id";
import { Trainer } from "src/trainer/domain/trainer";
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { ToggleTrainerFollowServiceResponseDto } from "../../dto/responses/toggle-trainer-follow-service-response.dto";

export class UnfollowTrainerApplicationService implements IApplicationService<TogggleTrainerFollowServiceEntryDto, ToggleTrainerFollowServiceResponseDto> {
    private readonly trainerRepository: ITrainerRepository;
    private readonly eventHandler: IEventHandler;

    constructor (trainerRepository: ITrainerRepository, eventHandler: IEventHandler)
    {
        this.trainerRepository = trainerRepository;
        this.eventHandler = eventHandler;
    }
    
    async execute(data: TogggleTrainerFollowServiceEntryDto): Promise<Result<ToggleTrainerFollowServiceResponseDto>> {
        //TEST
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

        let toggleResult:Result<string>;
        if (isIncluded)
        {
            toggleResult = trainerValue.removeFollower(userId);
        }
        else
        {
            return Result.fail<ToggleTrainerFollowServiceResponseDto>(new Error("No se encuentra siguiendo al entrenador. No es posible desuscribir"), 409, "No se encuentra siguiendo al entrenador. No es posible desuscribir");
        }
        //TEST
        if (!toggleResult.isSuccess())
        {
            return Result.fail<ToggleTrainerFollowServiceResponseDto>(toggleResult.Error, toggleResult.StatusCode, toggleResult.Message);
        }
        //TEST

        const persistenceUpdateResult = await this.trainerRepository.unfollowTrainer(trainerId.Value, userId.Id);
        if (!persistenceUpdateResult.isSuccess())
        {
            return Result.fail<ToggleTrainerFollowServiceResponseDto>( persistenceUpdateResult.Error, persistenceUpdateResult.StatusCode, persistenceUpdateResult.Message );
        }
        //TEST
        await this.eventHandler.publish( trainerValue.pullEvents() );
        //TEST
        return Result.success<ToggleTrainerFollowServiceResponseDto>( {message: "Suscripcion eliminada exitosamente"}, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}