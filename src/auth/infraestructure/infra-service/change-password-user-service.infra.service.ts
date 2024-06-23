import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IEncryptor } from "../../../common/Application/encryptor/encryptor.interface";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { ChangePasswordEntryDto } from "./dto/entry/change-password-entry.infraestructure.dto";

export class ChangePasswordUserInfraService implements IApplicationService<ChangePasswordEntryDto, any> {
    
    private readonly userRepository: IInfraUserRepository
    private readonly encryptor: IEncryptor; 

    constructor(
        userRepository: IInfraUserRepository,
        encryptor: IEncryptor
    ){
        this.userRepository = userRepository
        this.encryptor = encryptor
    }
    
    async execute(updateDto: ChangePasswordEntryDto): Promise<Result<any>> {
        const result = await this.userRepository.updateUserPassword(
            updateDto.email,
            await this.encryptor.hashPassword( updateDto.password )
        )
        if ( !result.isSuccess() ) return Result.fail( new Error('Something went wrong changing password'), 500, 'Something whent wrong changing password' )
        return Result.success({}, 200)
    }
   
    get name(): string { return this.constructor.name }
}