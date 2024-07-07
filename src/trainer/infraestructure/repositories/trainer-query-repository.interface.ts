import { Result } from "src/common/Domain/result-handler/Result";
import { OdmTrainerEntity } from "../entities/odm-entities/odm-trainer.entity";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"

export interface TrainerQueryRepository {
    findTrainerById (trainerId: string): Promise<Result<OdmTrainerEntity>>
    findTrainerByEmail(email:string): Promise<Result<OdmTrainerEntity>>;
    findTrainerById(id:string): Promise<Result<OdmTrainerEntity>>;
    findTrainersByLocation(latitude:string, longitude:string, pagination:PaginationDto): Promise<Result<OdmTrainerEntity[]>>; //to-do Revamp Location from string into something more useful
    findTrainersByFollower(followerID:string, pagination:PaginationDto): Promise<Result<OdmTrainerEntity[]>>;
    findAllTrainers(pagination:PaginationDto): Promise<Result<OdmTrainerEntity[]>>;

    findAllTrainerFollowersId(id:string, pagination:PaginationDto): Promise<Result<string[]>>;
    getFollowerCount(id:string):Promise<Result<number>>;
    getUserFollowingCount(userId:string):Promise<Result<number>>;
    checkIfFollowerExists(trainerID:string, followerID:string):Promise<Result<boolean>>;

    followTrainer(trainerID:string, userID:string): Promise<Result<string>>;
    unfollowTrainer(trainerID:string, userID:string): Promise<Result<string>>;
}