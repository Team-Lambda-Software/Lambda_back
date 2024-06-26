/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity";
import { UserQueryRepository } from "../user-query-repository.interface";
import { Model } from "mongoose";

export class OdmUserRepository implements UserQueryRepository{

    private readonly userModel: Model<OdmUserEntity>

    constructor(userModel: Model<OdmUserEntity>){
        this.userModel = userModel
    }

    async saveUser(user: OdmUserEntity): Promise<void> {
        
        const newUserOdm = new this.userModel(user)
        
        await newUserOdm.save()
    }

    async findUserById(userId: string): Promise<Result<OdmUserEntity>> {
        try{
            const user = await this.userModel.findOne( { id: userId } )
            if(user){
                return Result.success<OdmUserEntity>(user,200)
            }
            return Result.fail<OdmUserEntity>(new Error("User not founded"),404,"User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity>( error, 500, "Internal Server Error" )
        }
    }

    async findUserByEmail(email: string): Promise<Result<OdmUserEntity>> {
        try{
            const user = await this.userModel.findOne( { email: email } )
            if(user){
                return Result.success<OdmUserEntity>(user,200)
            }
            return Result.fail<OdmUserEntity>(new Error("User not founded"),404,"User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity>( error, 500, "Internal Server Error" )
        }
    }

    async findAllUser(): Promise<Result<OdmUserEntity[]>> {
        try{
            const user: OdmUserEntity[] = await this.userModel.find().exec()
            if(user){
                return Result.success<OdmUserEntity[]>(user,200)
            }
            return Result.fail<OdmUserEntity[]>(new Error("User not founded"),404,"User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity[]>( error, 500, "Internal Server Error" )
        }
    }
    
}