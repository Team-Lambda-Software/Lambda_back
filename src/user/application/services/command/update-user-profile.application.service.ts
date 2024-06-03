/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
//import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { Result } from "src/common/Application/result-handler/Result";
import { UpdateUserProfileServiceEntryDto } from "../../dto/params/update-user-profile-service-entry.dto";
import { UpdateUserProfileServiceResponseDto } from "../../dto/responses/update-user-profile-service-response.dto";
import { IInfraUserRepository } from "src/user/infraestructure/repositories/interfaces/orm-infra-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

export class UpdateUserProfileAplicationService implements IApplicationService<UpdateUserProfileServiceEntryDto,UpdateUserProfileServiceResponseDto>{
    
    private readonly userRepository: IInfraUserRepository

    constructor ( userRepository: IInfraUserRepository){
        this.userRepository = userRepository
    }

    async execute(data: UpdateUserProfileServiceEntryDto): Promise<Result<UpdateUserProfileServiceResponseDto>> {
        
        const user = await this.userRepository.findUserById(data.userId)

        if(!user.isSuccess()){
           return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message);
        }

        const userUpdate = OrmUser.create(
            user.Value.id,
            (data.phone) ? data.phone: user.Value.phone, 
            (data.name) ? data.name: user.Value.name,
            (data.email) ? data.email: user.Value.email,
            (data.password) ? data.password: user.Value.password,
            user.Value.type
        )

        const updateResult = await this.userRepository.saveOrmUser(userUpdate);

        if(!updateResult.isSuccess()){
            return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message)
        }

        const respuesta: UpdateUserProfileServiceResponseDto = {
            userId: updateResult.Value.id
        }

        return Result.success<UpdateUserProfileServiceResponseDto>(respuesta,200)

    }

    get name(): string {
        return this.constructor.name
    }

}