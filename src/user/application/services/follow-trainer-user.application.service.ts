/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Trainer } from "src/trainer/domain/trainer";
import { FollowUnfollowEntryDtoService } from "src/user/dto/follow-unfollow-entry-Service";

export class FollowTrainerUserApplicationService implements IApplicationService<FollowUnfollowEntryDtoService,Trainer>{
    
    private readonly trainerRepository: ITrainerRepository

    constructor ( trainerRepository: ITrainerRepository)
    {
        this.trainerRepository = trainerRepository
    }

    execute(data: FollowUnfollowEntryDtoService): Promise<Result<Trainer>> 
    {
        const resultado = this.trainerRepository.followTrainer(data.trainerId,data.userId);

        return resultado;
    }
    
    get name(): string 
    {
        return this.constructor.name;
    }

    
}