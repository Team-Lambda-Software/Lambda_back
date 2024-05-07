import { Result } from "src/common/Application/result-handler/Result";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Repository, DataSource, InsertResult } from "typeorm";
import { OrmTrainer } from "../../entities/orm-entities/trainer.entity";
import { OrmTrainerMapper } from "../../mappers/orm-mapper/orm-trainer-mapper";
import { Trainer } from "src/trainer/domain/trainer";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";

export class OrmTrainerRepository extends Repository<OrmTrainer> implements ITrainerRepository
{
    private readonly ormTrainerMapper: OrmTrainerMapper;

    constructor (mapper: OrmTrainerMapper, dataSource: DataSource)
    {
        super( OrmTrainer, dataSource.createEntityManager() );
        this.ormTrainerMapper = mapper;
    }

    async findTrainerByEmail(email:string):Promise<Result<Trainer>>
    {
        const trainer = await this.findOneBy( {email} );
        if ( trainer != null)
        {
            return Result.success<Trainer>( await this.ormTrainerMapper.fromPersistenceToDomain(trainer), 200);
        }
        return Result.fail<Trainer>(new Error("Trainer not found"), 404, "Trainer not found");
    }

    async findTrainerById(id:string):Promise<Result<Trainer>>
    {
        const trainer = await this.findOneBy( {id} );
        if ( trainer != null)
        {
            return Result.success<Trainer>( await this.ormTrainerMapper.fromPersistenceToDomain(trainer), 200);
        }
        return Result.fail<Trainer>(new Error("Trainer not found"), 404, "Trainer not found");
    }

    async findTrainersByLocation(location:string, pagination:PaginationDto): Promise<Result<Array<Trainer>>>
    {
        try
        {
            const trainers = await this.find( {where: {location: location}, skip:pagination.offset, take:pagination.limit } );

            if (trainers.length > 0)
            {
                return Result.success<Trainer[]>( await Promise.all( trainers.map( async trainer => await this.ormTrainerMapper.fromPersistenceToDomain( trainer ) ) ), 200 )
            }
            return Result.fail<Trainer[]>( new Error("Trainers not found"), 404, "Trainers not found");
        }
        catch (error)
        {
            return Result.fail<Trainer[]>( new Error(error.detail), error.code, error.detail );
        }
    } 

    async findTrainersByFollower(followerID:string, pagination:PaginationDto): Promise<Result<Array<Trainer>>>
    {
        try
        {
            const trainers = await this.createQueryBuilder().select('trainer').from(OrmTrainer, 'trainer')
                                    .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
                                    .where('follows.follower_id = :id', {id: followerID})
                                    .skip(pagination.offset)
                                    .take(pagination.limit)
                                    .getMany();
            if (trainers.length > 0)
            {
                return Result.success<Trainer[]>( await Promise.all( trainers.map( async trainer => await this.ormTrainerMapper.fromPersistenceToDomain( trainer ) ) ), 200 )
            }
            return Result.fail<Trainer[]>( new Error("Trainers not found"), 404, "Trainers not found");
        }
        catch (error)
        {
            return Result.fail<Trainer[]>( new Error(error.detail), error.code, error.detail );
        }
    }    

    async findAllTrainerFollowersId(id:string, pagination:PaginationDto): Promise<Result<Array<string>>>
    {
        try
        {
            const followersID = await this.createQueryBuilder().select('follows.follower_id').from(OrmTrainer, 'trainer')
                                    .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
                                    .where('follows.trainer_id = :target', {target: id})
                                    .skip(pagination.offset)
                                    .take(pagination.limit)
                                    .getRawMany<string>();
            if (followersID.length > 0)
            {
                return Result.success<string[]>( followersID, 200 )
            }
            return Result.fail<string[]>( new Error("Followers not found"), 404, "Followers not found");
        }
        catch (error)
        {
            return Result.fail<string[]>( new Error(error.detail), error.code, error.detail );
        }
    }

    async getFollowerCount(id:string): Promise<Result<number>>
    {
        try
        {
            const followerCount = await this.createQueryBuilder().select('COUNT(follows.follower_id)').from(OrmTrainer, 'trainer')
                                    .innerJoin('follows', 'follows', 'follows.trainer_id = trainer.id')
                                    .where('follows.trainer_id = :target', {target: id})
                                    .getRawOne<number>();
            if (followerCount != null)
            {
                return Result.success<number>( followerCount, 200 )
            }
            return Result.fail<number>( new Error("Followers could not be counted"), 404, "Followers could not be counted");
        }
        catch (error)
        {
            return Result.fail<number>( new Error(error.detail), error.code, error.detail );
        }
    }

    //Adds a new follower to a given trainer
    async followTrainer(trainerID:string, userID:string): Promise<Result<Trainer>>
    {
        try
        {
            await this.createQueryBuilder()
                        .insert()
                        .into('follows')
                        .values([
                            { trainer_id: trainerID, follower_id: userID }
                        ])
                        .execute();
            return this.findTrainerById(trainerID);
        }
        catch (error)
        {
            return Result.fail<Trainer>(new Error(error.detail), error.code, error.detail);
        }
    }

    //Removes a follower from a given trainer
    async unfollowTrainer(trainerID:string, userID:string): Promise<Result<Trainer>>
    {
        try
        {
            await this.createQueryBuilder()
                        .delete()
                        .from('follows')
                        .where("trainer_id = :tid", { tid: trainerID } )
                        .andWhere("user_id = :uid", { uid: userID } )
                        .execute();
            return this.findTrainerById(trainerID);
        }
        catch (error)
        {
            return Result.fail<Trainer>(new Error(error.detail), error.code, error.detail);
        }
    }
}