import { Result } from "src/common/Domain/result-handler/Result"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { TrainerQueryRepository } from "src/trainer/infraestructure/repositories/trainer-query-repository.interface"
import { TrainerFollowed } from "src/trainer/domain/events/trainer-followed-event"




export class TrainerFollowQuerySyncronizer implements Querysynchronizer<TrainerFollowed>{
    
    private readonly trainerRepository: TrainerQueryRepository

    constructor ( trainerRepository: TrainerQueryRepository ){
        this.trainerRepository = trainerRepository
    }
    
    async execute ( event: TrainerFollowed ): Promise<Result<string>>
    {
        const trainer = await this.trainerRepository.followTrainer( event.trainerId, event.userId )
        if (!trainer.isSuccess())
        {
            return Result.fail<string>(trainer.Error, trainer.StatusCode, trainer.Message)
        }
        
        return Result.success<string>( "success", 200 )

    }

}