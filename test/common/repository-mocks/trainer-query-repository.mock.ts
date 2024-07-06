import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { TrainerQueryRepository } from "src/trainer/infraestructure/repositories/trainer-query-repository.interface"



export class TrainerQueryRepositoryMock implements TrainerQueryRepository{
    findTrainerByEmail ( email: string ): Promise<Result<OdmTrainerEntity>>
    {
        throw new Error( "Method not implemented." )
    }
    findTrainersByLocation ( latitude: string, longitude: string, pagination: PaginationDto ): Promise<Result<OdmTrainerEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findTrainersByFollower ( followerID: string, pagination: PaginationDto ): Promise<Result<OdmTrainerEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findAllTrainers ( pagination: PaginationDto ): Promise<Result<OdmTrainerEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findAllTrainerFollowersId ( id: string, pagination: PaginationDto ): Promise<Result<string[]>>
    {
        throw new Error( "Method not implemented." )
    }
    getFollowerCount ( id: string ): Promise<Result<number>>
    {
        throw new Error( "Method not implemented." )
    }
    getUserFollowingCount ( userId: string ): Promise<Result<number>>
    {
        throw new Error( "Method not implemented." )
    }
    checkIfFollowerExists ( trainerID: string, followerID: string ): Promise<Result<boolean>>
    {
        throw new Error( "Method not implemented." )
    }
    async followTrainer ( trainerID: string, userID: string ): Promise<Result<string>>
    {

        return Result.success<string>( "Trainer followed", 200 )

    }
    async unfollowTrainer ( trainerID: string, userID: string ): Promise<Result<string>>
    {
        return Result.success<string>( "Trainer unfollowed", 200 )
    }
    
    private readonly trainers: OdmTrainerEntity[] = []
    
    async saveTrainer ( trainer: OdmTrainerEntity ): Promise<Result<string>>
    {
        this.trainers.push( trainer )
        return Result.success<string>( "Trainer saved", 200 )
    }

    async findTrainerById ( trainerId: string ): Promise<Result<OdmTrainerEntity>>
    {
        const trainer = this.trainers.find( trainer => trainer.id === trainerId )
        if ( !trainer )
        {
            return Result.fail<OdmTrainerEntity>( new Error("Trainer not found"), 404, "Trainer not found" )
        }
        return Result.success<OdmTrainerEntity>( trainer, 200 )
    }
}