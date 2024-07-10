/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer";
import { OdmUserEntity } from "../entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";
import { OrmUser } from "../entities/orm-entities/user.entity";
import { UserQueryRepository } from "../repositories/user-query-repository.interface";

export class AccountQuerySynchronizer implements Querysynchronizer<OrmUser>{
    
    private readonly odmUserRepository: UserQueryRepository
    private readonly userModel: Model<OdmUserEntity>

    constructor(odmUserRepository: UserQueryRepository, userModel: Model<OdmUserEntity>){
        this.odmUserRepository = odmUserRepository
        this.userModel = userModel
    }
    
    async execute(user: OrmUser): Promise<Result<string>> {
        const userOdmPersistence = new this.userModel({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            image: user.image,
            phone: user.phone,
            type: user.type
        })
        try{
            await this.odmUserRepository.saveUser(userOdmPersistence)            
        }catch(error){
            return Result.fail<string>( error, 500, error.detail )
        }

        return Result.success<string>( 'success', 201 )
    }

}