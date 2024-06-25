import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IEncryptor } from "../../../common/Application/encryptor/encryptor.interface";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { ChangePasswordEntryDto } from "./dto/entry/change-password-entry.infraestructure.dto";
import { UserQueryRepository } from "src/user/infraestructure/repositories/user-query-repository.interface";
import { InfraUserQuerySynchronizer } from "src/user/infraestructure/query-synchronizer/user-infra-query-synchronizer";

export class ChangePasswordUserInfraService implements IApplicationService<ChangePasswordEntryDto, any> {
    
    private readonly userRepository: IInfraUserRepository
    private readonly encryptor: IEncryptor; 
    private readonly syncroInfraUser: UserQueryRepository

    constructor(
        userRepository: IInfraUserRepository,
        encryptor: IEncryptor,
        syncroInfraUser: UserQueryRepository
    ){
        this.userRepository = userRepository
        this.encryptor = encryptor
        this.syncroInfraUser = syncroInfraUser
    }
    
    async execute(updateDto: ChangePasswordEntryDto): Promise<Result<any>> {
        const result = await this.userRepository.updateUserPassword(
            updateDto.email,
            await this.encryptor.hashPassword( updateDto.password )
        )
        if ( !result.isSuccess() ) return Result.fail( new Error('Something went wrong changing password'), 500, 'Something whent wrong changing password' )
        const userOrm = await this.userRepository.findUserByEmail( updateDto.email )
        const userOdm = await (await this.syncroInfraUser.findUserByEmail( updateDto.email )).Value
        userOdm.password = await result.Value.password
        this.syncroInfraUser.saveUser(userOdm)
        return Result.success({}, 200)
    }
   
    get name(): string { return this.constructor.name }
}