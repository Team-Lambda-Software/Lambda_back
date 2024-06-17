/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Trainer } from "src/trainer/domain/trainer";
import { FollowUnfollowEntryDtoService } from "../../dto/params/follow-unfollow-entry-Service";
export class UnfollowTrainerUserApplicationService implements IApplicationService<FollowUnfollowEntryDtoService,Trainer>{
    
    private readonly trainerRepository: ITrainerRepository;

    constructor ( trainerRepository: ITrainerRepository)
    {
        this.trainerRepository = trainerRepository
    }

    async execute(data: FollowUnfollowEntryDtoService): Promise<Result<Trainer>> 
    {

        const trainer = await this.trainerRepository.findTrainerById(data.trainerId)

        if(!trainer.isSuccess()){
            return Result.fail<Trainer>(trainer.Error,trainer.StatusCode,trainer.Message);
        } 

        const resultado = await this.trainerRepository.unfollowTrainer(data.trainerId,data.userId)

        return resultado;
    }

    get name(): string 
    {
        return this.constructor.name;
    }


}