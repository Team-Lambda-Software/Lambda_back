import { Result } from "src/common/Domain/result-handler/Result";
import { OdmTrainerEntity } from "../entities/odm-entities/odm-trainer.entity";

export interface TrainerQueryRepository {
    findTrainerById (trainerId: string): Promise<Result<OdmTrainerEntity>>
}