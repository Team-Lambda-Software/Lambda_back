import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IEncryptor } from "../../../common/Application/encryptor/encryptor.interface";
import { ChangePasswordEntryDto } from "./dto/entry/change-password-entry.infraestructure.dto";
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity";

export class ChangePasswordUserInfraService implements IApplicationService<ChangePasswordEntryDto, boolean> {
    
    private readonly sqlAccountRepo: IAccountRepository<OrmUser>
    private readonly nosqlAccountRepo: IAccountRepository<OdmUserEntity>
    private readonly encryptor: IEncryptor; 

    constructor(
        sqlRepository: IAccountRepository<OrmUser>,
        encryptor: IEncryptor,
        nosqlRepository: IAccountRepository<OdmUserEntity>
    ){
        this.sqlAccountRepo = sqlRepository
        this.encryptor = encryptor
        this.nosqlAccountRepo = nosqlRepository
    }
    
    async execute(updateDto: ChangePasswordEntryDto): Promise<Result<boolean>> {
        const hashPassword = await this.encryptor.hashPassword( updateDto.password )
        const result = await this.sqlAccountRepo.updateUserPassword( updateDto.email, hashPassword )
        if ( !result.isSuccess() ) return Result.fail( new Error('Something went wrong changing password'), 500, 'Something whent wrong changing password' )
        await this.nosqlAccountRepo.updateUserPassword( updateDto.email, hashPassword )
        return Result.success(true, 200)
    }
   
    get name(): string { return this.constructor.name }
}