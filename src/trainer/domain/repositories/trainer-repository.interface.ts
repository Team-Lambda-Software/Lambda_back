import { Result } from 'src/common/Domain/result-handler/Result';
import { Trainer } from '../trainer';

export interface ITrainerRepository {
  findTrainerByEmail(email: string): Promise<Result<Trainer>>;
  findTrainerById(id: string): Promise<Result<Trainer>>;

  getFollowerCount(id: string): Promise<Result<number>>;
  getUserFollowingCount(userId: string): Promise<Result<number>>;
  checkIfFollowerExists(
    trainerID: string,
    followerID: string,
  ): Promise<Result<boolean>>;

  //to-do updateTrainerLocation(id:string, newLocation:string): Promise<Result<Trainer>>; //to-do Location revamp
  followTrainer(trainerID: string, userID: string): Promise<Result<Trainer>>;
  unfollowTrainer(trainerID: string, userID: string): Promise<Result<Trainer>>;

  saveTrainer(trainer: Trainer): Promise<Result<Trainer>>;
}
