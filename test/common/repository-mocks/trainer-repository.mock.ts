import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { Trainer } from "src/trainer/domain/trainer"
import { UserId } from "src/user/domain/value-objects/user-id"



export class TrainerMockRepository implements ITrainerRepository {
    findAllTrainers ( pagination: PaginationDto ): Promise<Result<Trainer[]>>
    {
        throw new Error( "Method not implemented." )
    }
    getUserFollowingCount ( userId: string ): Promise<Result<number>>
    {
        throw new Error( "Method not implemented." )
    }
    
    private readonly trainers: Trainer[] = []
    
    async saveTrainer ( trainer: Trainer ): Promise<void>
    {
        this.trainers.push( trainer )
    }

    findTrainerByEmail ( email: string ): Promise<Result<Trainer>>
    {
        throw new Error( "Method not implemented." )
    }
    async findTrainerById ( id: string ): Promise<Result<Trainer>>
    {
        const trainer = this.trainers.find( trainer => trainer.Id.Value === id )
        if( trainer === undefined )
        {
            return Result.fail<Trainer>(new Error(`Trainer with id ${id} not found`) ,404,`Trainer with id ${id} not found`)
        }
        return Result.success<Trainer>( trainer , 200 )
    }
    findTrainersByLocation ( latitude: string, longitude: string, pagination: PaginationDto ): Promise<Result<Array<Trainer>>>
    {
        throw new Error( "Method not implemented." )
    }
    findTrainersByFollower ( followerID: string, pagination: PaginationDto ): Promise<Result<Array<Trainer>>>
    {
        throw new Error( "Method not implemented." )
    }
    findAllTrainerFollowersId ( id: string, pagination: PaginationDto ): Promise<Result<Array<string>>>
    {
        throw new Error( "Method not implemented." )
    }
    getFollowerCount ( id: string ): Promise<Result<number>>
    {
        throw new Error( "Method not implemented." )
    }
    checkIfFollowerExists ( trainerID: string, followerID: string ): Promise<Result<boolean>>
    {
        throw new Error( "Method not implemented." )
    }
    async followTrainer ( trainerID: string, userID: string ): Promise<Result<Trainer>>
    {
        const trainer = await this.findTrainerById( trainerID )
        if( !trainer.isSuccess() )
        {
            return Result.fail<Trainer>(new Error(`Trainer with id ${trainerID} not found`) ,404,`Trainer with id ${trainerID} not found`)
        }
        this.trainers.filter( trainer => trainer.Id.Value !== trainerID )
        trainer.Value.addFollower( UserId.create(userID) )
        await this.saveTrainer( trainer.Value )
        return Result.success<Trainer>( trainer.Value , 200 )

    }
    async unfollowTrainer ( trainerID: string, userID: string ): Promise<Result<Trainer>>
    {
        const trainer = await this.findTrainerById( trainerID )
        if( !trainer.isSuccess() )
        {
            return Result.fail<Trainer>(new Error(`Trainer with id ${trainerID} not found`) ,404,`Trainer with id ${trainerID} not found`)
        }
        this.trainers.filter( trainer => trainer.Id.Value !== trainerID )
        trainer.Value.removeFollower( UserId.create(userID) )
        await this.saveTrainer( trainer.Value )
        return Result.success<Trainer>( trainer.Value , 200 )
    }

}