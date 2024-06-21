import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/auth/application/dto/jwt-payload.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper";
import { OrmInfraUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-infra-user-repository";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { DataSource } from "typeorm";

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