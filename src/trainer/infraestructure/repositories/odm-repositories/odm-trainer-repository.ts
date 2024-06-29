import { Model } from "mongoose";
import { OdmTrainerEntity } from "../../entities/odm-entities/odm-trainer.entity";
import { TrainerQueryRepository } from "../trainer-query-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";

export class OdmTrainerRepository implements TrainerQueryRepository {
    private readonly trainerModel: Model<OdmTrainerEntity>

    constructor ( trainerModel: Model<OdmTrainerEntity> )
    {
        this.trainerModel = trainerModel;
    }
    
    async findTrainerById(trainerId: string): Promise<Result<OdmTrainerEntity>> {
        try
        {
            const odmTrainer = await this.trainerModel.findOne( {id: trainerId} );
            return Result.success<OdmTrainerEntity>( odmTrainer, 200 );
        }
        catch (error)
        {
            return Result.fail<OdmTrainerEntity>(new Error(error.message), 500, error.message);
        }
    }
}