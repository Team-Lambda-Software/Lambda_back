import { Result } from 'src/common/Application/result-handler/Result'
import { Trainer } from '../trainer'
import { PaginationDto } from 'src/common/Infraestructure/dto/entry/pagination.dto';

export interface ITrainerRepository {
    findTrainerByEmail(email:string): Promise<Result<Trainer>>;
    findTrainerById(id:string): Promise<Result<Trainer>>;
    findTrainersByLocation(latitude:string, longitude:string, pagination:PaginationDto): Promise<Result<Array<Trainer>>>; //to-do Revamp Location from string into something more useful
    findTrainersByFollower(followerID:string, pagination:PaginationDto): Promise<Result<Array<Trainer>>>;

    findAllTrainerFollowersId(id:string, pagination:PaginationDto): Promise<Result<Array<string>>>;
    getFollowerCount(id:string):Promise<Result<number>>;
    checkIfFollowerExists(trainerID:string, followerID:string):Promise<Result<boolean>>;

    //to-do updateTrainerLocation(id:string, newLocation:string): Promise<Result<Trainer>>; //to-do Location revamp
    followTrainer(trainerID:string, userID:string): Promise<Result<Trainer>>;
    unfollowTrainer(trainerID:string, userID:string): Promise<Result<Trainer>>;
}