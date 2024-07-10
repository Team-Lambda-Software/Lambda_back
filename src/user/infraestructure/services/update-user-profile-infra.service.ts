/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { UpdateUserProfileInfraServiceResponseDto } from "./dto/update-user-profile-infra-service-response-dto";
import { UpdateUserProfileInfraServiceEntryDto } from "./dto/update-user-profile-infra-service-entry-dto";
import { OrmUser } from "../entities/orm-entities/user.entity";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { IEncryptor } from "src/common/Application/encryptor/encryptor.interface";
import { IFileUploader } from "src/common/Application/file-uploader/file-uploader.interface";
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";
import { OdmUserEntity } from "../entities/odm-entities/odm-user.entity";

export class UpdateUserProfileInfraService implements IApplicationService<UpdateUserProfileInfraServiceEntryDto,UpdateUserProfileInfraServiceResponseDto>{
    
    private readonly sqlRepository: IAccountRepository<OrmUser>
    private nosqlRepository: IAccountRepository<OdmUserEntity>
    private readonly idGenerator: IdGenerator<string>
    private readonly encryptor: IEncryptor
    private readonly fileUploader: IFileUploader

    constructor ( 
        sqlRepository: IAccountRepository<OrmUser>,
        nosqlRepository: IAccountRepository<OdmUserEntity>,
        idGenerator: IdGenerator<string>,
        encryptor: IEncryptor,
        fileUploader: IFileUploader
    ){
        this.sqlRepository = sqlRepository
        this.nosqlRepository = nosqlRepository
        this.idGenerator = idGenerator
        this.encryptor = encryptor
        this.fileUploader = fileUploader
    }

    async execute(data: UpdateUserProfileInfraServiceEntryDto): Promise<Result<UpdateUserProfileInfraServiceResponseDto>> {
        
        const user = await this.sqlRepository.findUserById(data.userId)
        
        if(!user.isSuccess())
            return Result.fail<UpdateUserProfileInfraServiceResponseDto>(user.Error,user.StatusCode,user.Message)

        const userResult = user.Value

        const userUpdate: OrmUser = await OrmUser.create(
            userResult.id,
            userResult.name,
            userResult.phone,
            userResult.email,
            (data.image) ? await this.fileUploader.UploadFile( data.image, await this.idGenerator.generateId() ) : userResult.image,
            (data.password) ? await this.encryptor.hashPassword(data.password) : userResult.password,
        )
        
        const updateResult = await this.sqlRepository.saveUser(userUpdate)

        if(!updateResult.isSuccess()) 
            return Result.fail<UpdateUserProfileInfraServiceResponseDto>(updateResult.Error,updateResult.StatusCode,updateResult.Message)

        const findResult = await this.nosqlRepository.findUserById( userResult.id )
        const findValue = findResult.Value
        if ( data.image ) findValue.image = userUpdate.image
        if ( data.password ) findValue.password = userUpdate.password

        const synchronizerResponse = await this.nosqlRepository.saveUser( findValue )
        
        if(!synchronizerResponse.isSuccess())
            return Result.fail<UpdateUserProfileInfraServiceResponseDto>(synchronizerResponse.Error,synchronizerResponse.StatusCode,synchronizerResponse.Message)

        const respuesta: UpdateUserProfileInfraServiceResponseDto = {
            userId: userResult.id
        }

        return Result.success<UpdateUserProfileInfraServiceResponseDto>(respuesta,200)
    }

    get name(): string {
        return this.constructor.name
    }

}