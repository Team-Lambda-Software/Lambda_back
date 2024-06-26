import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { TogggleTrainerFollowServiceEntryDto } from "../../dto/parameters/toggle-trainer-follow-service-entry.dto";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers";
import { UserId } from "src/user/domain/value-objects/user-id";
import { Trainer } from "src/trainer/domain/trainer";
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";

export class ToggleTrainerFollowApplicationService implements IApplicationService<TogggleTrainerFollowServiceEntryDto, void> {
    private readonly trainerRepository: ITrainerRepository;
    private readonly eventHandler: IEventHandler;

    constructor (trainerRepository: ITrainerRepository, eventHandler: IEventHandler)
    {
        this.trainerRepository = trainerRepository;
        this.eventHandler = eventHandler;
    }
    
    async execute(data: TogggleTrainerFollowServiceEntryDto): Promise<Result<void>> {
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

        let toggleResult:Result<void>;
        if (isIncluded)
        {
            toggleResult = trainerValue.removeFollower(userId);
        }
        else
        {
            toggleResult = trainerValue.addFollower(userId);
        }
        if (!toggleResult.isSuccess())
        {
            return Result.fail<void>(toggleResult.Error, toggleResult.StatusCode, toggleResult.Message);
        }

        let persistenceUpdateResult: Result<Trainer>
        if (isIncluded)
        {
            persistenceUpdateResult = await this.trainerRepository.unfollowTrainer(trainerId.Value, userId.Id);
        }
        else
        {
            persistenceUpdateResult = await this.trainerRepository.followTrainer(trainerId.Value, userId.Id);
        }
        if (!persistenceUpdateResult.isSuccess())
        {
            return Result.fail<void>( persistenceUpdateResult.Error, persistenceUpdateResult.StatusCode, persistenceUpdateResult.Message );
        }
        this.eventHandler.publish( trainerValue.pullEvents() );
        return Result.success<void>( undefined, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}