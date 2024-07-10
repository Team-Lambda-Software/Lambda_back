/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity";
import { UserQueryRepository } from "../user-query-repository.interface";
import { Model } from "mongoose";
import { UserNotFoundException } from "../../exceptions/user-not-found-exception";

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
            return Result.fail<OdmUserEntity>(new UserNotFoundException(), 403, "User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity>( new Error(error.message), 500, "Error al buscar usuario" )
        }
    }

    async findUserByEmail(email: string): Promise<Result<OdmUserEntity>> {
        try{
            const user = await this.userModel.findOne( { email: email } )
            if(user){
                return Result.success<OdmUserEntity>(user,200)
            }
            return Result.fail<OdmUserEntity>(new UserNotFoundException(), 403, "User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity>( new Error(error.message), 500, "Error al buscar usuario" )
        }
    }

    async findAllUser(): Promise<Result<OdmUserEntity[]>> {
        try{
            const user: OdmUserEntity[] = await this.userModel.find().exec()
            if(user){
                return Result.success<OdmUserEntity[]>(user,200)
            }
            return Result.fail<OdmUserEntity[]>(new UserNotFoundException(), 403, "User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity[]>( new Error(error.message), 500, "Error al buscar usuarios" )
        }
    }
    
}