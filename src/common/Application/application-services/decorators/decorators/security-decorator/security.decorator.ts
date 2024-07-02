import { Result } from "src/common/Domain/result-handler/Result";
import { ApplicationServiceEntryDto } from "../../../dto/application-service-entry.dto";
import { ApplicationServiceDecorator } from "../../application-service.decorator";
import { IApplicationService } from "../../../application-service.interface";
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

export class SecurityDecorator<L extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<L, R> {

    private readonly accountRepository: IAccountRepository<OrmUser>
    private readonly allowedRoles: string[] = [];

    constructor( 
        applicationService: IApplicationService<L, R>, 
        accountRepository: IAccountRepository<OrmUser>,
        allowedRoles: string[]
    ){
        super( applicationService )
        this.accountRepository = accountRepository
        this.allowedRoles = allowedRoles
    }

    async execute ( data: L ): Promise<Result<R>> {
        console.log(data)
        const userResult = await this.accountRepository.findUserById(data.userId);
        if ( !userResult.isSuccess() ) return Result.fail(new Error('Usuario no registrado'), 500, 'Usuario no existe')
        
        const checkResult = await this.checkAuthorization( userResult.Value )
        if ( !checkResult ) return Result.fail(new Error('Sin permisos suficientes'), 403, 'Usuario no posee permisos suficientes' );

        const result = await super.execute( data )
        return result
    }

    private async checkAuthorization( user: OrmUser ) {
        if ( !this.allowedRoles.includes( user.type ) ) return false        
        return true
    }

}
