/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer";
import { UserCreated } from "src/user/domain/events/user-created-event";
import { OdmUserEntity } from "../entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";
import { UserEmailModified } from "src/user/domain/events/user-email-modified-event";
import { UserNameModified } from "src/user/domain/events/user-name-modified-event";
import { UserPhoneModified } from "src/user/domain/events/user-phone-modified-event";
import { DomainEvent } from "src/common/Domain/domain-event/domain-event";
import { UserQueryRepository } from "../repositories/user-query-repository.interface";

export class UserQuerySynchronizer implements Querysynchronizer<UserCreated>{
    
    private readonly odmUserRepository: UserQueryRepository
    private readonly userModel: Model<OdmUserEntity>

    constructor(odmUserRepository: UserQueryRepository, userModel: Model<OdmUserEntity>){
        this.odmUserRepository = odmUserRepository
        this.userModel = userModel
    }
    
    async execute(event: DomainEvent): Promise<Result<string>> {

        let userOdmPersistence: OdmUserEntity
        switch(event.eventName){
            case "UserCreated":
                const userCreated: UserCreated = event as UserCreated;
                userOdmPersistence = (await this.UserCreatedHandler(userCreated)).Value
                break;
            case 'UserEmailModified':
                const userEmailModified: UserEmailModified = event as UserEmailModified;
                userOdmPersistence = (await this.EmailModifiedHandler(userEmailModified)).Value
                break;
            case 'UserNameModified':
                const userNameModified: UserNameModified = event as UserNameModified;
                userOdmPersistence = (await this.NameModifiedHandler(userNameModified)).Value
                break;
            case 'UserPhoneModified':
                const userPhoneModified: UserPhoneModified = event as UserPhoneModified;
                userOdmPersistence = (await this.PhoneModifiedHandler(userPhoneModified)).Value
                break;
            default: 
                return Result.fail<string>(new Error("Evento no existente"),400,"Evento no existente")
        }

        try{
            await this.odmUserRepository.saveUser(userOdmPersistence)            
        }catch(error){
            return Result.fail<string>( error, 500, error.detail )
        }

        return Result.success<string>( 'success', 201 )
    }

    private async UserCreatedHandler(event: UserCreated): Promise<Result<OdmUserEntity>>{
        const userOdmPersistence = new this.userModel({
            id: event.userId,
            name: event.userName,
            email: event.userEmail,
            phone: event.userPhone
        })
        return Result.success<OdmUserEntity>(userOdmPersistence,200)
    }

    private async EmailModifiedHandler(event: UserEmailModified): Promise<Result<OdmUserEntity>>{
        const user = await this.odmUserRepository.findUserById(event.id)
        if(!user.isSuccess())
            return Result.fail<OdmUserEntity>( user.Error, 500, user.Message )
        const odmuser = user.Value
        odmuser.email = event.email
        return Result.success<OdmUserEntity>(odmuser,200)
    }

    private async NameModifiedHandler(event: UserNameModified): Promise<Result<OdmUserEntity>>{
        const user = await this.odmUserRepository.findUserById(event.userId)
        if(!user.isSuccess())
            return Result.fail<OdmUserEntity>( user.Error, 500, user.Message )
        const odmuser = user.Value
        odmuser.name = event.userName
        return Result.success<OdmUserEntity>(odmuser,200)
    }

    private async PhoneModifiedHandler(event: UserPhoneModified): Promise<Result<OdmUserEntity>>{
        const user = await this.odmUserRepository.findUserById(event.userId)
        if(!user.isSuccess())
            return Result.fail<OdmUserEntity>( user.Error, 500, user.Message )
        const odmuser = user.Value
        odmuser.phone = event.userPhone
        return Result.success<OdmUserEntity>(odmuser,200)
    }

}