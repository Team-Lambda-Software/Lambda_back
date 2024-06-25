import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface"
import { Trainer } from "src/trainer/domain/trainer"



export class TrainerMockRepository implements ITrainerRepository {
    
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
    followTrainer ( trainerID: string, userID: string ): Promise<Result<Trainer>>
    {
        throw new Error( "Method not implemented." )
    }
    unfollowTrainer ( trainerID: string, userID: string ): Promise<Result<Trainer>>
    {
        throw new Error( "Method not implemented." )
    }

}