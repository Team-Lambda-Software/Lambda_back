import { Model } from 'mongoose';
import { OdmTrainerEntity } from '../../entities/odm-entities/odm-trainer.entity';
import { TrainerQueryRepository } from '../trainer-query-repository.interface';
import { Result } from 'src/common/Domain/result-handler/Result';
import { PaginationDto } from 'src/common/Infraestructure/dto/entry/pagination.dto';
import { OdmUserEntity } from 'src/user/infraestructure/entities/odm-entities/odm-user.entity';

export class OdmTrainerRepository implements TrainerQueryRepository {
  private readonly trainerModel: Model<OdmTrainerEntity>;
  private readonly userModel: Model<OdmUserEntity>;
  constructor(
    trainerModel: Model<OdmTrainerEntity>,
    userModel: Model<OdmUserEntity>,
  ) {
    this.trainerModel = trainerModel;
    this.userModel = userModel;
  }
  async saveTrainer(trainer: OdmTrainerEntity): Promise<Result<void>> {
    try {
      await this.trainerModel.create(trainer);
      return Result.success<void>(null, 200);
    } catch (error) {
      return Result.fail<void>(error, 500, error.message);
    }
  }
  async followTrainer(
    trainerID: string,
    userID: string,
  ): Promise<Result<string>> {
    try {
      const odmTrainer = await this.trainerModel.findOne({ id: trainerID });

      if (odmTrainer == null) {
        return Result.fail<string>(
          new Error('Trainer not found'),
          404,
          'Trainer not found',
        );
      }
      const odmUser = await this.userModel.findOne({ id: userID });
      if (odmUser == null) {
        return Result.fail<string>(
          new Error('User not found'),
          404,
          'User not found',
        );
      }
      odmTrainer.followers.push(odmUser);
      await this.trainerModel.updateOne({ id: trainerID }, odmTrainer);
      return Result.success<string>('success', 200);
    } catch (error) {
      return Result.fail<string>(error, 500, error.message);
    }
  }
  async unfollowTrainer(
    trainerID: string,
    userID: string,
  ): Promise<Result<string>> {
    try {
      const odmTrainer = await this.trainerModel.findOne({ id: trainerID });
      if (odmTrainer == null) {
        return Result.fail<string>(
          new Error('Trainer not found'),
          404,
          'Trainer not found',
        );
      }
      const odmUser = await this.userModel.findOne({ id: userID });
      if (odmUser == null) {
        return Result.fail<string>(
          new Error('User not found'),
          404,
          'User not found',
        );
      }
      const userIndex = odmTrainer.followers.findIndex(
        (follower) => follower.id == userID,
      );
      if (userIndex == -1) {
        return Result.fail<string>(
          new Error('User is not following this trainer'),
          404,
          'User is not following this trainer',
        );
      }
      odmTrainer.followers.splice(userIndex, 1);
      await this.trainerModel.updateOne({ id: trainerID }, odmTrainer);
      return Result.success<string>('success', 200);
    } catch (error) {
      return Result.fail<string>(error, 500, error.message);
    }
  }
  async findTrainerByEmail(email: string): Promise<Result<OdmTrainerEntity>> {
    try {
      const odmTrainer = await this.trainerModel.findOne({ email: email });
      if (odmTrainer == null) {
        return Result.fail<OdmTrainerEntity>(
          new Error('Trainer not found'),
          404,
          'Trainer not found',
        );
      }
      return Result.success<OdmTrainerEntity>(odmTrainer, 200);
    } catch (error) {
      return Result.fail<OdmTrainerEntity>(error, 500, error.message);
    }
  }
  async findTrainersByLocation(
    latitude: string,
    longitude: string,
    pagination: PaginationDto,
  ): Promise<Result<OdmTrainerEntity[]>> {
    try {
      const odmTrainers = await this.trainerModel
        .find({ latitude: latitude, longitude: longitude })
        .skip((pagination.page - 1) * pagination.perPage)
        .limit(pagination.perPage);
      if (odmTrainers.length == 0) {
        return Result.success<OdmTrainerEntity[]>([], 200);
      }
      return Result.success<OdmTrainerEntity[]>(odmTrainers, 200);
    } catch (error) {
      return Result.fail<OdmTrainerEntity[]>(error, 500, error.message);
    }
  }
  async findTrainersByFollower(
    followerID: string,
    pagination: PaginationDto,
  ): Promise<Result<OdmTrainerEntity[]>> {
    try {
      const odmTrainers = await this.trainerModel
        .find({ 'followers.id': followerID })
        .skip((pagination.page - 1) * pagination.perPage)
        .limit(pagination.perPage);
      if (odmTrainers.length == 0) {
        return Result.success<OdmTrainerEntity[]>([], 200);
      }
      return Result.success<OdmTrainerEntity[]>(odmTrainers, 200);
    } catch (error) {
      return Result.fail<OdmTrainerEntity[]>(error, 500, error.message);
    }
  }
  async findAllTrainers(
    pagination: PaginationDto,
  ): Promise<Result<OdmTrainerEntity[]>> {
    try {
      const odmTrainers = await this.trainerModel
        .find()
        .skip((pagination.page - 1) * pagination.perPage)
        .limit(pagination.perPage);
      if (odmTrainers.length == 0) {
        return Result.success<OdmTrainerEntity[]>([], 200);
      }
      return Result.success<OdmTrainerEntity[]>(odmTrainers, 200);
    } catch (error) {
      return Result.fail<OdmTrainerEntity[]>(error, 500, error.message);
    }
  }
  async findAllTrainerFollowersId(
    id: string,
    pagination: PaginationDto,
  ): Promise<Result<string[]>> {
    try {
      const odmTrainer = await this.trainerModel.findOne({ id: id });
      if (odmTrainer == null) {
        return Result.fail<string[]>(
          new Error('Trainer not found'),
          404,
          'Trainer not found',
        );
      }
      const followersId: string[] = odmTrainer.followers.map(
        (follower) => follower.id,
      );
      return Result.success<string[]>(followersId, 200);
    } catch (error) {
      return Result.fail<string[]>(error, 500, error.message);
    }
  }
  async getFollowerCount(id: string): Promise<Result<number>> {
    try {
      const odmTrainer = await this.trainerModel.findOne({ id: id });
      if (odmTrainer == null) {
        return Result.fail<number>(
          new Error('Trainer not found'),
          404,
          'Trainer not found',
        );
      }
      return Result.success<number>(odmTrainer.followers.length, 200);
    } catch (error) {
      return Result.fail<number>(error, 500, error.message);
    }
  }
  async getUserFollowingCount(userId: string): Promise<Result<number>> {
    try {
      const odmTrainers = await this.trainerModel.find({
        'followers.id': userId,
      });
      if (!odmTrainers) {
        return Result.fail<number>(
          new Error('Followed trainers could not be counted'),
          404,
          'Followed trainers could not be counted',
        );
      }
      return Result.success<number>(odmTrainers.length, 200);
    } catch (error) {
      return Result.fail<number>(error, 500, error.message);
    }
  }
  async checkIfFollowerExists(
    trainerID: string,
    followerID: string,
  ): Promise<Result<boolean>> {
    try {
      const odmTrainer = await this.trainerModel.findOne({ id: trainerID });
      if (odmTrainer == null) {
        return Result.fail<boolean>(
          new Error('Trainer not found'),
          404,
          'Trainer not found',
        );
      }
      const followerExists = odmTrainer.followers.find(
        (follower) => follower.id == followerID,
      );
      return Result.success<boolean>(followerExists != null, 200);
    } catch (error) {
      return Result.fail<boolean>(error, 500, error.message);
    }
  }

  async findTrainerById(trainerId: string): Promise<Result<OdmTrainerEntity>> {
    try {
      const odmTrainer = await this.trainerModel.findOne({ id: trainerId });
      if (odmTrainer == null) {
        return Result.fail<OdmTrainerEntity>(
          new Error('Trainer not found'),
          404,
          'Trainer not found',
        );
      }
      return Result.success<OdmTrainerEntity>(odmTrainer, 200);
    } catch (error) {
      return Result.fail<OdmTrainerEntity>(
        new Error(error.message),
        500,
        error.message,
      );
    }
  }
}
