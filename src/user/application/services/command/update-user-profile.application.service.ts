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

export class UpdateUserProfileAplicationService implements IApplicationService<UpdateUserProfileServiceEntryDto,UpdateUserProfileServiceResponseDto>{
    
    private readonly userRepository: IUserRepository
    private readonly fileUploader: IFileUploader
    private readonly idGenerator: IdGenerator<string>

    constructor ( userRepository: IUserRepository, fileUploader: IFileUploader, idGenerator: IdGenerator<string>){
        this.userRepository = userRepository
        this.fileUploader = fileUploader
        this.idGenerator = idGenerator
    }

    async execute(data: UpdateUserProfileServiceEntryDto): Promise<Result<UpdateUserProfileServiceResponseDto>> {
        
        const user = await this.userRepository.findUserById(data.userId)

        if(!user.isSuccess){
           return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message);
        }
        
        const userUpdate: User = user.Value

        if(data.name) userUpdate.updateName(data.name)
        if(data.image){
            const imageId = await this.idGenerator.generateId()
            const imageUrl = await this.fileUploader.UploadFile( data.image, imageId )
            userUpdate.updateImage(imageUrl)
        } 
        if(data.email) userUpdate.updateEmail(data.email)
        if(data.password) userUpdate.updatePassword(data.password)
        if(data.phone) userUpdate.updatePhone(data.phone)
        
        const updateResult = await this.userRepository.saveUserAggregate(userUpdate);

        if(!updateResult.isSuccess){
            return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message)
        }

        const respuesta: UpdateUserProfileServiceResponseDto = {
            userId: updateResult.Value.Id
        }

        return Result.success<UpdateUserProfileServiceResponseDto>(respuesta,200)

    }

    get name(): string {
        return this.constructor.name
    }

}