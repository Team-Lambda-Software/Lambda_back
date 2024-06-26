import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { TogggleTrainerFollowServiceEntryDto } from "../../dto/parameters/toggle-trainer-follow-service-entry.dto";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { TrainerFollowers } from "src/trainer/domain/value-objects/trainer-followers";
import { UserId } from "src/user/domain/value-objects/user-id";
import { Trainer } from "src/trainer/domain/trainer";
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";

export class ToggleTrainerFollowApplicationService implements IApplicationService<TogggleTrainerFollowServiceEntryDto, string> {
    private readonly trainerRepository: ITrainerRepository;
    private readonly eventHandler: IEventHandler;

    constructor (trainerRepository: ITrainerRepository, eventHandler: IEventHandler)
    {
        this.trainerRepository = trainerRepository;
        this.eventHandler = eventHandler;
    }
    
    async execute(data: TogggleTrainerFollowServiceEntryDto): Promise<Result<string>> {
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
            toggleResult = trainerValue.removeFollower(userId);
        }
        else
        {
            toggleResult = trainerValue.addFollower(userId);
        }
        //TEST
            console.log("Domain toggle finished.", toggleResult);
        if (!toggleResult.isSuccess())
        {
            return Result.fail<string>(toggleResult.Error, toggleResult.StatusCode, toggleResult.Message);
        }
        //TEST
            console.log("Domain toggle success");

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
            return Result.fail<string>( persistenceUpdateResult.Error, persistenceUpdateResult.StatusCode, persistenceUpdateResult.Message );
        }
        //TEST
            console.log("Persistence toggle success");
        this.eventHandler.publish( trainerValue.pullEvents() );
        //TEST
            console.log("service execution success");
        return Result.success<string>( "Cambio realizado exitosamente", 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}