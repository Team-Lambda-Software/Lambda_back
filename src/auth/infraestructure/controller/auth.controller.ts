import { Controller, Post } from "@nestjs/common"
import { LogInEntryInfrastructureDto } from "../dto/log-in-entry.infrastructure.dto";
import { SignUpEntryInfrastructureDto } from "../dto/sign-up-entry.infrastructure.dto";
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { Logger } from "@nestjs/common";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { DataSource } from "typeorm";
import { Inject } from "@nestjs/common";
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper";
import { Body } from "@nestjs/common";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { IJwtGenerator } from "src/auth/application/interface/jwt-generator.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { JwtGenerator } from "../jwt/jwt-generator";
import { SignUpEntryApplicationDto } from "src/auth/application/dto/sign-up-entry.application.dto";
import { LogInEntryApplicationDto } from "src/auth/application/dto/log-in-entry.application.dto";
import { IEncryptor } from "src/auth/application/interface/encryptor.interface";
import { EncryptorBcrypt } from "../encryptor/encryptor-bcrypt";
import { LogInUserApplicationService } from "src/auth/application/services/log-in-user-service.application.service";
import { SignUpUserApplicationService } from "src/auth/application/services/sign-up-user-service.application.service";

@Controller('auth')
export class AuthController {
    private readonly logger: Logger = new Logger('AuthController')
    private readonly userRepository: IUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor; 
  
    constructor(@Inject('DataSource') private readonly dataSource: DataSource) {
        this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator()
        this.encryptor = new EncryptorBcrypt()
    }

    @Post('loginuser')
    async logInUser(@Body() logInDto: LogInEntryInfrastructureDto) {
        const data: LogInEntryApplicationDto = {
            userId: 'none',
            ...logInDto,
        }
        const logInUserService = new ExceptionDecorator( 
            new LoggingDecorator(
                new LogInUserApplicationService(
                    this.userRepository,
                    this.tokenGenerator,
                    this.encryptor
                ), 
                new NativeLogger(this.logger)
            )
        )
        return (await logInUserService.execute(data)).Value
    }
    
    @Post('signupuser')
    async signUpUser(@Body() signUpDto: SignUpEntryInfrastructureDto) {
        const data: SignUpEntryApplicationDto = {
            userId: 'none',
            ...signUpDto,
        }
        const signUpApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new SignUpUserApplicationService(
                    this.userRepository,
                    this.uuidGenerator,
                    this.tokenGenerator,
                    this.encryptor
                ), 
                new NativeLogger(this.logger)
            )
        )
        return (await signUpApplicationService.execute(data)).Value
    }

}

