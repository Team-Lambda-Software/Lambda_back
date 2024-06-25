/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer";
import { UserCreated } from "src/user/domain/events/user-created-event";
import { OdmUserRepository } from "../repositories/odm-repository/odm-user-repository";
import { User } from "src/user/domain/user";
import { OdmUserEntity } from "../entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";

export class UserQuerySynchronizer implements Querysynchronizer<UserCreated>{
    
    private readonly odmUserRepository: OdmUserRepository
    private readonly userModel: Model<OdmUserEntity>

    constructor(odmUserRepository: OdmUserRepository, userModel: Model<OdmUserEntity>){
        this.odmUserRepository = odmUserRepository
        this.userModel = userModel
    }
    
    async execute(event: UserCreated): Promise<Result<string>> {
        const user = User.create(
            event.userId,
            event.userName,
            event.userPhone,
            event.userEmail
        )

        const userOdmPersistence = new this.userModel({
            id: user.Id.Id,
            name: user.Name.Name,
            email: user.Email.Email,
            phone: user.Phone.Phone
        })

        try{
            await this.odmUserRepository.saveUser(userOdmPersistence)            
        }catch(error){
            return Result.fail<string>( error, 500, error.detail )
        }

        return Result.success<string>( 'success', 201 )
    }

}