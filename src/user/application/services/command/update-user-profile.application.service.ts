/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { UpdateUserProfileServiceEntryDto } from "../../dto/params/update-user-profile-service-entry.dto";
import { UpdateUserProfileServiceResponseDto } from "../../dto/responses/update-user-profile-service-response.dto";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { UserName } from "src/user/domain/value-objects/user-name";
import { UserPhone } from "src/user/domain/value-objects/user-phone";
import { UserEmail } from "src/user/domain/value-objects/user-email";

export class UpdateUserProfileAplicationService implements IApplicationService<UpdateUserProfileServiceEntryDto,UpdateUserProfileServiceResponseDto>{
    
    private readonly userRepository: IUserRepository
    private readonly eventHandler: IEventHandler

    constructor ( 
        userRepository: IUserRepository,
        eventHandler: IEventHandler
    ){
        this.userRepository = userRepository
        this.eventHandler = eventHandler
    }

    async execute(data: UpdateUserProfileServiceEntryDto): Promise<Result<UpdateUserProfileServiceResponseDto>> {
        
        const user = await this.userRepository.findUserById(data.userId)
        
        if(!user.isSuccess())
            return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message)

        const userResult = user.Value

        try{

            if(data.name) userResult.updateName(UserName.create(data.name))

            if(data.email) userResult.updateEmail(UserEmail.create(data.email))

            if(data.phone) userResult.updatePhone(UserPhone.create(data.phone))

            const updateResult = await this.userRepository.saveUserAggregate(userResult);
            await this.eventHandler.publish(userResult.pullEvents())

            const respuesta: UpdateUserProfileServiceResponseDto = {
                userId: updateResult.Value.Id.Id,
            }

            return Result.success<UpdateUserProfileServiceResponseDto>(respuesta,200)

        }catch(error){
            return Result.fail<UpdateUserProfileServiceResponseDto>(error,500,error.message)
        }
    }

    get name(): string {
        return this.constructor.name
    }

}