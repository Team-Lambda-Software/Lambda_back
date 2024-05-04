/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
//import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { Result } from "src/common/Application/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { userUpdateEntryDtoService } from "src/user/dto/user-update-entry-Service";

export class UpdateUserProfileAplicationService implements IApplicationService<userUpdateEntryDtoService,User>{
    
    private readonly userRepository: IUserRepository

    constructor ( userRepository: IUserRepository){
        this.userRepository = userRepository
    }

    async execute(data: userUpdateEntryDtoService): Promise<Result<User>> {
        
        const user = await this.userRepository.findUserById(data.userId)

        if(!user.isSuccess){
           return Result.fail<User>(user.Error,user.StatusCode,user.Message);
        }
        
        const userUpdate: User = user.Value

        if(data.firstName) userUpdate.updateFirstName(data.firstName)
        if(data.firstLastName) userUpdate.updateFirstLastName(data.firstLastName)
        if(data.secondLastName) userUpdate.updateSecondLastName(data.secondLastName)
        if(data.email) userUpdate.updateEmail(data.email)
        if(data.password) userUpdate.updatePassword(data.password)
        if(data.phone) userUpdate.updatePhone(data.phone)
        
        const updateResult = await this.userRepository.saveUserAggregate(userUpdate);

        if(!updateResult.isSuccess){
            return Result.fail<User>(user.Error,user.StatusCode,user.Message)
        }

        return updateResult

    }

    get name(): string {
        return this.constructor.name
    }

}