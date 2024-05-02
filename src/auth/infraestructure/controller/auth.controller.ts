import { Controller, Post, UseGuards } from "@nestjs/common"
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
import { JwtService } from "@nestjs/jwt";
import { UpdatePasswordSender } from "src/common/Infraestructure/utils/email-sender/update-password-sender.infraestructure";
import { ICodeGenerator } from "src/auth/application/interface/code-generator.interface";
import { CodeGenerator } from "../code-generator/code-generator";
import { GetCodeForUpdatePasswordUserInfrastructureDto } from "../dto/get-code-update-password-user-entry.infrastructure.dto";
import { UpdatePasswordUserInfrastructureDto } from "../dto/update-password-user.entry.infraestructure.dto";
import { UpdatePasswordUserApplicationService } from "src/auth/application/services/update-password-user-service.application.service";
import { UpdatePasswordEntryApplicationDto } from "src/auth/application/dto/update-password-entry.application.dto";
import { GetCodeUpdatePasswordUserApplicationService } from "src/auth/application/services/get-code-update-password-service.application.service";
import { GetCodeUpdatePasswordEntryApplicationDto } from "src/auth/application/dto/get-code-update-password-entry.application";
import { WelcomeSender } from "src/common/Infraestructure/utils/email-sender/welcome-sender.infraestructure";
import { JwtAuthGuard } from "../jwt/decorator/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    private readonly logger: Logger = new Logger('AuthController')
    private readonly userRepository: IUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor; 
    private readonly codeGenerator: ICodeGenerator<number[]>;

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
        private jwtAuthService: JwtService
    ) {
        this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()
        this.codeGenerator = new CodeGenerator()
    }

    @Post('checktoken')
    @UseGuards(JwtAuthGuard)
    async checkToken() {
        return {
            checkAuthorization: true
        }
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
                    this.encryptor,
                    new WelcomeSender()
                ), 
                new NativeLogger(this.logger)
            )
        )
        return (await signUpApplicationService.execute(data)).Value
    }
    
    @Post('getcodeupdatepassword')
    async getCodeForUpdatePasswordUser(@Body() getCodeUpdateDto: GetCodeForUpdatePasswordUserInfrastructureDto ) {
        const data: GetCodeUpdatePasswordEntryApplicationDto = {
            userId: 'none',
            ...getCodeUpdateDto,
        }
        const getCodeUpdatePasswordApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new GetCodeUpdatePasswordUserApplicationService(
                    this.userRepository,
                    new UpdatePasswordSender(),
                    this.codeGenerator,
                ), 
                new NativeLogger(this.logger)
            )
        )
        return (await getCodeUpdatePasswordApplicationService.execute(data)).Value
    }

    @Post('updatepassword')
    async updatePasswordUser(@Body() updatePasswordDto: UpdatePasswordUserInfrastructureDto ) {
        const data: UpdatePasswordEntryApplicationDto = {
            userId: 'none',
            ...updatePasswordDto,
        }
        const updatePasswordApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new UpdatePasswordUserApplicationService(
                    this.userRepository,
                    this.encryptor
                ), 
                new NativeLogger(this.logger)
            )
        )
        return (await updatePasswordApplicationService.execute(data)).Value
    }

}

