/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
//import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { Result } from "src/common/Application/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { UpdateUserProfileServiceEntryDto } from "../../dto/params/update-user-profile-service-entry.dto";
import { UpdateUserProfileServiceResponseDto } from "../../dto/responses/update-user-profile-service-response.dto";
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { IInfraUserRepository } from "src/user/infraestructure/repositories/interfaces/orm-infra-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

export class UpdateUserProfileAplicationService implements IApplicationService<UpdateUserProfileServiceEntryDto,UpdateUserProfileServiceResponseDto>{
    
    private readonly userRepository: IInfraUserRepository
    private readonly fileUploader: IFileUploader
    private readonly idGenerator: IdGenerator<string>

    constructor ( userRepository: IInfraUserRepository, fileUploader: IFileUploader, idGenerator: IdGenerator<string>){
        this.userRepository = userRepository
        this.fileUploader = fileUploader
        this.idGenerator = idGenerator
    }

    async execute(data: UpdateUserProfileServiceEntryDto): Promise<Result<UpdateUserProfileServiceResponseDto>> {
        
        const user = await this.userRepository.findUserById(data.userId)

        if (!user.isSuccess()) return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message);
 
        const userResult = user.Value
        const userUpdate: OrmUser = await OrmUser.create(
            userResult.id,
            (data.phone) ? data.phone : userResult.phone,
            (data.name) ? data.name : userResult.name,
            (data.image) ? await this.fileUploader.UploadFile( data.image, await this.idGenerator.generateId() ) : userResult.image,
            (data.email) ? data.email : userResult.email,
            (data.password) ? data.password : userResult.password,
        )

        const updateResult = await this.userRepository.saveOrmUser(userUpdate);

        if(!updateResult.isSuccess) return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message)

        const respuesta: UpdateUserProfileServiceResponseDto = {
            userId: updateResult.Value.id
        }

        return Result.success<UpdateUserProfileServiceResponseDto>(respuesta,200)

    }

    get name(): string {
        return this.constructor.name
    }

}