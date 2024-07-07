import { Result } from "src/common/Domain/result-handler/Result"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { TrainerQueryRepository } from "src/trainer/infraestructure/repositories/trainer-query-repository.interface"
import { TrainerUnfollowed } from "src/trainer/domain/events/trainer-unfollowed-event"




export class TrainerUnFollowQuerySyncronizer implements Querysynchronizer<TrainerUnfollowed>{
    
    private readonly trainerRepository: TrainerQueryRepository

    constructor ( trainerRepository: TrainerQueryRepository){
        this.trainerRepository = trainerRepository
    }
    
    async execute ( event: TrainerUnfollowed ): Promise<Result<string>>
    {
        const trainer = await this.trainerRepository.unfollowTrainer( event.trainerId, event.userId )
        if (!trainer.isSuccess())
        {
            return Result.fail<string>(trainer.Error, trainer.StatusCode, trainer.Message)
        }
        
        return Result.success<string>( "success", 200 )

    }

}