import { Result } from "src/common/Domain/result-handler/Result"
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";

export class OdmAccountRepository implements IAccountRepository<OdmUserEntity> {

    private readonly userModel: Model<OdmUserEntity>

    constructor(userModel: Model<OdmUserEntity>){
        this.userModel = userModel
    }

    async updateUserPassword(email: string, newPassword: string): Promise<Result<boolean>> {
        try {
            await this.userModel.findOneAndUpdate( { email: email }, { password: newPassword } )
            return Result.success<boolean>( true, 200 )
        } catch (error) {
            return Result.fail<boolean>( error, 500, "Internal Server Error" )
        }
    }

    async findAllUsers(): Promise<Result<OdmUserEntity[]>> {
        try{
            const user: OdmUserEntity[] = await this.userModel.find().exec()
            if (user){
                return Result.success<OdmUserEntity[]>(user,200)
            }
            return Result.fail<OdmUserEntity[]>(new Error("User not founded"),404,"User not founded")
        } catch(error){
            return Result.fail<OdmUserEntity[]>( error, 500, "Internal Server Error" )
        }
    }

    async saveUser(user: OdmUserEntity): Promise<Result<boolean>> {
        try { 
            const result = await this.userModel.create(user)
            return Result.success<boolean>(true, 200)
        } catch (error) {
            return Result.fail<boolean>( error, 500, "Internal Server Error" )
        }
    }

    async findUserById(userId: string): Promise<Result<OdmUserEntity>> {
        try{
            const user = await this.userModel.findOne( { id: userId } )
            if (user){
                return Result.success<OdmUserEntity>(user,200)
            }
            return Result.fail<OdmUserEntity>(new Error("User not founded"),404,"User not founded")
        } catch(error){
            return Result.fail<OdmUserEntity>( error, 500, "Internal Server Error" )
        }
    }

    async findUserByEmail(email: string): Promise<Result<OdmUserEntity>> {
        try{
            const user = await this.userModel.findOne( { email: email } )
            if (user) return Result.success<OdmUserEntity>(user,200)
            return Result.fail<OdmUserEntity>(new Error("User not founded"),404,"User not founded")
        } catch(error){
            return Result.fail<OdmUserEntity>( error, 500, "Internal Server Error" )
        }
    }

}