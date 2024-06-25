import { Result } from "src/common/Domain/result-handler/Result"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { TrainerQueryRepository } from "src/trainer/infraestructure/repositories/trainer-query-repository.interface"



export class TrainerQueryRepositoryMock implements TrainerQueryRepository{
    
    private readonly trainers: OdmTrainerEntity[] = []
    
    async saveTrainer ( trainer: OdmTrainerEntity ): Promise<Result<string>>
    {
        this.trainers.push( trainer )
        return Result.success<string>( "Trainer saved", 200 )
    }

    async findTrainerById ( trainerId: string ): Promise<Result<OdmTrainerEntity>>
    {
        const trainer = this.trainers.find( trainer => trainer.id === trainerId )
        if ( !trainer )
        {
            return Result.fail<OdmTrainerEntity>( new Error("Trainer not found"), 404, "Trainer not found" )
        }
        return Result.success<OdmTrainerEntity>( trainer, 200 )
    }
}