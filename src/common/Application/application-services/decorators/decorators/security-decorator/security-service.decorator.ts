import { Result } from "src/common/Domain/result-handler/Result";
import { ApplicationServiceEntryDto } from "../../../dto/application-service-entry.dto";
import { ApplicationServiceDecorator } from "../../application-service.decorator";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { IApplicationService } from "../../../application-service.interface";
import { User } from "src/user/domain/user";

export class SecurityServiceDecorator<L extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<L, R> {

    private readonly userRepository: IUserRepository
    private readonly allowedRoles: string[] = [];

    constructor( 
        applicationService: IApplicationService<L, R>, 
        userRepository: IUserRepository,
        allowedRoles: string[]
    ){
        super( applicationService )
        this.userRepository = userRepository
        this.allowedRoles = allowedRoles
    }

    async execute ( data: L ): Promise<Result<R>> {
        /*const userResult = await this.userRepository.findUserById(data.userId);
        if ( !userResult.isSuccess() ) return Result.fail(new Error('Usuario no registrado'), 500, 'Usuario no existe')
        
        const checkResult = await this.checkAuthorization( userResult.Value )
        if ( !checkResult ) return Result.fail(new Error('Sin permisos suficientes'), 403, 'Usuario no posee permisos suficientes' );
        */
        const result = await super.execute( data )
        return result
    }

    private async checkAuthorization( user: User ) {
        /*if ( !this.allowedRoles.includes( user.Type ) ) return false        
        return true*/
    }

}
