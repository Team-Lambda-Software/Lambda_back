/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer";
import { OdmUserRepository } from "../repositories/odm-repository/odm-user-repository";
import { OdmUserEntity } from "../entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";
import { OrmUser } from "../entities/orm-entities/user.entity";

export class UserQuerySynchronizer implements Querysynchronizer<OrmUser>{
    
    private readonly odmUserRepository: OdmUserRepository
    private readonly userModel: Model<OdmUserEntity>

    constructor(odmUserRepository: OdmUserRepository, userModel: Model<OdmUserEntity>){
        this.odmUserRepository = odmUserRepository
        this.userModel = userModel
    }
    
    async execute(event: OrmUser): Promise<Result<string>> {

        const userOdmPersistence = new this.userModel({
            id: event.id,
            name: event.name,
            email: event.email,
            password: event.password,
            image: event.image,
            phone: event.phone,
            type: event.type
        })

        try{
            await this.odmUserRepository.saveUser(userOdmPersistence)            
        }catch(error){
            return Result.fail<string>( error, 500, error.detail )
        }

        return Result.success<string>( 'success', 201 )
    }

}