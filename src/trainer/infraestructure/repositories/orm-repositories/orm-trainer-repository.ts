import { Result } from 'src/common/Domain/result-handler/Result';
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface';
import { Repository, DataSource, InsertResult } from 'typeorm';
import { OrmTrainer } from '../../entities/orm-entities/trainer.entity';
import { OrmTrainerMapper } from '../../mappers/orm-mapper/orm-trainer-mapper';
import { Trainer } from 'src/trainer/domain/trainer';
import { PaginationDto } from 'src/common/Infraestructure/dto/entry/pagination.dto';

export class OrmTrainerRepository
  extends Repository<OrmTrainer>
  implements ITrainerRepository
{
  private readonly ormTrainerMapper: OrmTrainerMapper;

  constructor(mapper: OrmTrainerMapper, dataSource: DataSource) {
    super(OrmTrainer, dataSource.createEntityManager());
    this.ormTrainerMapper = mapper;
  }
  async saveTrainer(trainer: Trainer): Promise<Result<Trainer>> {
    try {
      const ormTrainer =
        await this.ormTrainerMapper.fromDomainToPersistence(trainer);
      const result = await this.save(ormTrainer);
      return Result.success<Trainer>(
        await this.ormTrainerMapper.fromPersistenceToDomain(result),
        201,
      );
    } catch (error) {
      return Result.fail<Trainer>(error, 500, error.message);
    }
  }

  async findTrainerByEmail(email: string): Promise<Result<Trainer>> {
    const trainer = await this.findOneBy({ email });
    if (trainer != null) {
      return Result.success<Trainer>(
        await this.ormTrainerMapper.fromPersistenceToDomain(trainer),
        200,
      );
    }
    return Result.fail<Trainer>(
      new Error('Trainer not found'),
      404,
      'Trainer not found',
    );
  }

  async findTrainerById(id: string): Promise<Result<Trainer>> {
    const trainer = await this.findOneBy({ id });
    if (trainer != null) {
      return Result.success<Trainer>(
        await this.ormTrainerMapper.fromPersistenceToDomain(trainer),
        200,
      );
    }
    return Result.fail<Trainer>(
      new Error('Trainer not found'),
      404,
      'Trainer not found',
    );
  }

  async findTrainersByLocation(
    latitude: string,
    longitude: string,
    pagination: PaginationDto,
  ): Promise<Result<Array<Trainer>>> {
    try {
      const trainers = await this.find({
        where: { latitude: latitude, longitude: longitude },
        skip: (pagination.page - 1) * pagination.perPage,
        take: pagination.perPage,
      });

      if (trainers.length > 0) {
        return Result.success<Trainer[]>(
          await Promise.all(
            trainers.map(
              async (trainer) =>
                await this.ormTrainerMapper.fromPersistenceToDomain(trainer),
            ),
          ),
          200,
        );
      }
      return Result.success<Trainer[]>([], 200);
    } catch (error) {
      return Result.fail<Trainer[]>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  //Get all trainers that are being followed by a given user
  async findTrainersByFollower(
    followerID: string,
    pagination: PaginationDto,
  ): Promise<Result<Array<Trainer>>> {
    try {
      const trainers = await this.createQueryBuilder()
        .select('trainer')
        .from(OrmTrainer, 'trainer')
        .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
        .where('follows.follower_id = :id', { id: followerID })
        .skip((pagination.page - 1) * pagination.perPage)
        .take(pagination.perPage)
        .getMany();
      if (trainers.length > 0) {
        return Result.success<Trainer[]>(
          await Promise.all(
            trainers.map(
              async (trainer) =>
                await this.ormTrainerMapper.fromPersistenceToDomain(trainer),
            ),
          ),
          200,
        );
      }
      return Result.success<Trainer[]>([], 200);
    } catch (error) {
      return Result.fail<Trainer[]>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  //Get all trainers
  async findAllTrainers(pagination: PaginationDto): Promise<Result<Trainer[]>> {
    try {
      const ormTrainers = await this.find({
        order: { first_last_name: 'ASC' },
        skip: (pagination.page - 1) * pagination.perPage,
        take: pagination.perPage,
      });
      const trainers = await Promise.all(
        ormTrainers.map(
          async (trainer) =>
            await this.ormTrainerMapper.fromPersistenceToDomain(trainer),
        ),
      );
      return Result.success<Trainer[]>(trainers, 200);
    } catch (error) {
      return Result.fail<Trainer[]>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  //Check if a given user follows a given trainer
  async checkIfFollowerExists(
    trainerID: string,
    followerID: string,
  ): Promise<Result<boolean>> {
    try {
      const selectCount = await this.createQueryBuilder()
        .select('trainer')
        .from(OrmTrainer, 'trainer')
        .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
        .where('follows.follower_id = :fid', { fid: followerID })
        .andWhere('follows.trainer_id = :tid', { tid: trainerID })
        .getCount();
      if (selectCount > 0) {
        return Result.success<boolean>(true, 200);
      }
      return Result.success<boolean>(false, 200);
    } catch (error) {
      return Result.fail<boolean>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  //Get the Id of all the followers that a given trainer (by id) has
  async findAllTrainerFollowersId(
    id: string,
    pagination: PaginationDto,
  ): Promise<Result<Array<string>>> {
    try {
      const followersID = await this.createQueryBuilder()
        .select('follows.follower_id')
        .from(OrmTrainer, 'trainer')
        .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
        .where('follows.trainer_id = :target', { target: id })
        .skip((pagination.page - 1) * pagination.perPage)
        .take(pagination.perPage)
        .getRawMany<string>();
      if (followersID.length > 0) {
        return Result.success<string[]>(followersID, 200);
      }
      return Result.success<string[]>([], 200);
    } catch (error) {
      return Result.fail<string[]>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  async getFollowerCount(id: string): Promise<Result<number>> {
    try {
      const followerCount = await this.createQueryBuilder()
        .select('follows.follower_id')
        .from(OrmTrainer, 'trainer')
        .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
        .where('follows.trainer_id = :target', { target: id })
        .getCount();
      if (followerCount != null) {
        return Result.success<number>(followerCount, 200);
      }
      return Result.fail<number>(
        new Error('Followers could not be counted'),
        404,
        'Followers could not be counted',
      );
    } catch (error) {
      return Result.fail<number>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  async getUserFollowingCount(userId: string): Promise<Result<number>> {
    try {
      const followingCount = await this.createQueryBuilder()
        .select('follows.trainer_id')
        .from(OrmTrainer, 'trainer')
        .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
        .where('follows.follower_id = :target', { target: userId })
        .getCount();
      if (followingCount != null) {
        return Result.success<number>(followingCount, 200);
      }
      return Result.fail<number>(
        new Error('Followed trainers could not be counted'),
        404,
        'Followed trainers could not be counted',
      );
    } catch (error) {
      return Result.fail<number>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  //Adds a new follower to a given trainer
  async followTrainer(
    trainerID: string,
    userID: string,
  ): Promise<Result<Trainer>> {
    try {
      await this.createQueryBuilder()
        .insert()
        .into('follows')
        .values([{ trainer_id: trainerID, follower_id: userID }])
        .execute();
      return this.findTrainerById(trainerID);
    } catch (error) {
      return Result.fail<Trainer>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }

  //Removes a follower from a given trainer
  async unfollowTrainer(
    trainerID: string,
    userID: string,
  ): Promise<Result<Trainer>> {
    try {
      await this.createQueryBuilder()
        .delete()
        .from('follows')
        .where('trainer_id = :tid', { tid: trainerID })
        .andWhere('follower_id = :uid', { uid: userID })
        .execute();
      return this.findTrainerById(trainerID);
    } catch (error) {
      return Result.fail<Trainer>(
        new Error(error.message),
        error.code,
        error.message,
      );
    }
  }
}
