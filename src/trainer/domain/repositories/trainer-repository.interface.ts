import { Result } from 'src/common/Application/result-handler/Result'
import { Trainer } from '../trainer'

export interface ITrainerRepository {
    findTrainerByEmail(email:string): Promise<Result<Trainer>>;
    findTrainerById(id:string): Promise<Result<Trainer>>;
    findTrainerByLocation(location:string): Promise<Result<Trainer>>; //to-do Revamp Location from string into something more useful
    findTrainersByFollower(followerID:string): Promise<Result<Array<Trainer>>>;
    findAllTrainerSubscribersById(id:string): Promise<Result<Array<string>>>;

    updateTrainerLocation(newLocation:string): Promise<Result<Trainer>>; //to-do Location revamp
    followTrainer(userID:string): Promise<Result<Trainer>>;
    unfollowTrainer(userID:string): Promise<Result<Trainer>>;
}