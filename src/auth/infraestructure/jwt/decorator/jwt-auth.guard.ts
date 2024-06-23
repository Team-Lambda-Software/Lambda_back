import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Result } from "src/common/Domain/result-handler/Result";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmInfraUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-infra-user-repository";
import { DataSource } from "typeorm";
import { JwtPayload } from "./dto/jwt-payload.interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    private userRepository: OrmInfraUserRepository

    constructor(
        private jwtService: JwtService,
        @Inject('DataSource') dataSource: DataSource
    ) {
        this.userRepository = new OrmInfraUserRepository(dataSource)
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()       
        if ( !request.headers['authorization'] ) throw new UnauthorizedException() 
        const [type, token] = request.headers['authorization'].split(' ') ?? []
        if ( type != 'Bearer' || !token ) throw new UnauthorizedException()                       
        try {
            const payload = await this.jwtService.verifyAsync( token, { secret: process.env.JWT_SECRET_KEY } )
            const userData = await this.validate( payload )
            // Payload incluye iat y exp, fecha de firma y de vencimiento
            request['user'] = userData
        } catch { throw new UnauthorizedException() }
        return true
    }
    
    private async validate(payload: JwtPayload) {
        const user: Result<OrmUser> = await this.userRepository.findUserById( payload.id ); 
        if ( !user.isSuccess() ) throw new Error('Error buscando al usuario a traves del token')
        return user.Value;
    }

}