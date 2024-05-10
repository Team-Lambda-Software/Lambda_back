/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"
import { User } from "src/user/domain/user"




export class GetUserProfileApplicationService implements IApplicationService<ApplicationServiceEntryDto, User>{
    
    private readonly userRepository: IUserRepository

    constructor ( userRepository: IUserRepository){
        this.userRepository = userRepository
    }
    
    async execute ( data: ApplicationServiceEntryDto ): Promise<Result<User>>
    {
        const user = await this.userRepository.findUserById(data.userId)
        //TODO: Add the search for the user active courses

        return user
    }

    async executeByEmail( email : string ) : Promise<Result<User>>
    {
        const user = await this.userRepository.findUserByEmail(email);

        return user
    }


    get name (): string
    {
        return this.constructor.name
    }

}