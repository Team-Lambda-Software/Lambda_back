/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
//import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { Result } from "src/common/Domain/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { UpdateUserProfileServiceEntryDto } from "../../dto/params/update-user-profile-service-entry.dto";
import { UpdateUserProfileServiceResponseDto } from "../../dto/responses/update-user-profile-service-response.dto";
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { IEncryptor } from "src/common/Application/encryptor/encryptor.interface";
import { UserQueryRepository } from "src/user/infraestructure/repositories/user-query-repository.interface";

export class UpdateUserProfileAplicationService implements IApplicationService<UpdateUserProfileServiceEntryDto,UpdateUserProfileServiceResponseDto>{
    
    private readonly syncroInfraUser: UserQueryRepository
    private readonly userRepository: IInfraUserRepository
    private readonly fileUploader: IFileUploader
    private readonly idGenerator: IdGenerator<string>
    private readonly encryptor: IEncryptor

    constructor ( 
        syncroInfraUser: UserQueryRepository,
        userRepository: IInfraUserRepository, fileUploader: IFileUploader, idGenerator: IdGenerator<string>, encryptor:IEncryptor 
    
    ){
        this.syncroInfraUser = syncroInfraUser
        this.userRepository = userRepository
        this.fileUploader = fileUploader
        this.idGenerator = idGenerator
        this.encryptor = encryptor
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
            (data.password) ? await this.encryptor.hashPassword(data.password) : userResult.password,
        )

        const updateResult = await this.userRepository.saveOrmUser(userUpdate);

        if(!updateResult.isSuccess()) return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message)

        const userOdm = await (await this.syncroInfraUser.findUserById( data.userId )).Value
        if (data.phone) userOdm.phone = userUpdate.phone
        if (data.email) userOdm.email = userUpdate.email
        if (data.password) userOdm.password = userUpdate.password
        if (data.name) userOdm.name = userUpdate.name
        if (data.image) userOdm.image =  userUpdate.image
        this.syncroInfraUser.saveUser(userOdm)

        const respuesta: UpdateUserProfileServiceResponseDto = {
            userId: updateResult.Value.id
        }

        return Result.success<UpdateUserProfileServiceResponseDto>(respuesta,200)

    }

    get name(): string {
        return this.constructor.name
    }

}