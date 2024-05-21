import { Controller, Get, Post, Put, Query } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { Logger } from "@nestjs/common";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { DataSource } from "typeorm";
import { Inject } from "@nestjs/common";
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { IJwtGenerator } from "src/auth/application/interface/jwt-generator.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { JwtGenerator } from "../jwt/jwt-generator";
import { IEncryptor } from "src/auth/application/interface/encryptor.interface";
import { EncryptorBcrypt } from "../encryptor/encryptor-bcrypt";
import { LogInUserApplicationService } from "src/auth/application/services/log-in-user-service.application.service";
import { SignUpUserApplicationService } from "src/auth/application/services/sign-up-user-service.application.service";
import { JwtService } from "@nestjs/jwt";
import { UpdatePasswordSender } from "src/common/Infraestructure/utils/email-sender/update-password-sender.infraestructure";
import { SecretCodeGenerator } from "../secret-code-generator/secret-code-generator";
import { GetCodeUpdatePasswordUserApplicationService } from "src/auth/application/services/get-code-update-password-service.application.service";
import { WelcomeSender } from "src/common/Infraestructure/utils/email-sender/welcome-sender.infraestructure";
import { JwtAuthGuard } from "../jwt/decorator/jwt-auth.guard";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ForgetPasswordSwaggerResponseDto } from "../dto/response/forget-password-swagger-response.dto";
import { LogInUserSwaggerResponseDto } from "../dto/response/log-in-user-swagger-response.dto";
import { SignUpUserSwaggerResponseDto } from "../dto/response/sign-up-user-swagger-response.dto";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { GetUser } from "../jwt/decorator/get-user.param.decorator";
import { SignUpUserQueryParameterDto } from "../dto/query-parameter/sign-up-user-query-parameter.dto";
import { LogInUserQueryParameterDto } from "../dto/query-parameter/log-in-user-query-parameter.dto";
import { CodeValidateQueryParameterDto } from "../dto/query-parameter/code-validate-query-parameter.dto";
import { ChangePasswordQueryParameterDto } from "../dto/query-parameter/change-password-parameter.dto";
import { ForgetPasswordQueryParameterDto } from "../dto/query-parameter/forget-password-query-parameter.dto";
import { CurrentUserSwaggerResponseDto } from "../dto/response/current-user-swagger-response.dto";
import { ChangePasswordUserApplicationService } from "src/auth/application/services/change-password-user-service.application.service";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    private readonly userRepository: IUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>
    private readonly encryptor: IEncryptor
    private secretCodes = []

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
        private jwtAuthService: JwtService
    ) {
        this.logger = new Logger('AuthController')
        this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()
    }
    
    @Get('current')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Obtener usuario actual', type: CurrentUserSwaggerResponseDto })
    @ApiBearerAuth()
    async currentUser( @GetUser() user ) {
        return { user, image: 'image.jpg' } 
    }

    @Post('login')
    @ApiOkResponse({ description: 'Iniciar sesion de usuario', type: LogInUserSwaggerResponseDto })
    async logInUser(@Query() logInDto: LogInUserQueryParameterDto) {
        const data = { userId: 'none', ...logInDto }
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
    
    @Post('register')
    @ApiOkResponse({ description: 'Registrar un nuevo usuario en el sistema', type: SignUpUserSwaggerResponseDto })
    async signUpUser(@Query() signUpDto: SignUpUserQueryParameterDto) {
        var data = { userId: 'none', ...signUpDto }
        if ( data.type == null ) data = { type: 'CLIENT', ...data }
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
    
    @Post('forget/password')
    @ApiOkResponse({ description: 'Obtener codigo temporal para confirmar usuario', type: ForgetPasswordSwaggerResponseDto })
    async getCodeForUpdatePasswordUser(@Query() getCodeUpdateDto: ForgetPasswordQueryParameterDto ) {
        const data = { userId: 'none', ...getCodeUpdateDto, }
        const getCodeUpdatePasswordApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new GetCodeUpdatePasswordUserApplicationService(
                    this.userRepository,
                    new UpdatePasswordSender(),
                    new SecretCodeGenerator(),
                ), 
                new NativeLogger(this.logger)
            )
        )
        const result = await getCodeUpdatePasswordApplicationService.execute(data)
        if ( result.isSuccess() ) {
            this.secretCodes = this.secretCodes.filter( e => e.email != result.Value.email )
            this.secretCodes.push( result.Value )
        }
        return result.Value
    }

    @Put('change/password')
    //@ApiOkResponse({ description: 'Cambiar la contraseña del usuario', type: UpdatePasswordUserSwaggerResponseDto })
    async changePasswordUser(@Query() updatePasswordDto: ChangePasswordQueryParameterDto ) {     
        const result = this.verifyCode(updatePasswordDto.code, updatePasswordDto.email)  
        if ( !result ) return { message: 'code invalid', code: updatePasswordDto.code }
        const data = { userId: 'none',  ...updatePasswordDto }
        const changePasswordApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new ChangePasswordUserApplicationService(
                    this.userRepository,
                    this.encryptor
                ), 
                new NativeLogger(this.logger)
            )
        )
        return (await changePasswordApplicationService.execute(data)).Value
    }
    
    @Post('code/validate')
    //@ApiOkResponse({  description: 'Validar codigo de cambio de contraseña', type: NewTokenSwaggerResponseDto })
    async validateCode( @Query() codeValDto: CodeValidateQueryParameterDto ) {  
        return { ok: true } 
    }

    private verifyCode( code: string, email: string ) {
        var nowTime = new Date().getTime()
        var search = this.secretCodes.filter( e => (e.code == code && e.email == email) )
        if ( search.length == 0 ) return false
        if ( (nowTime - search[0].date)/1000 >= 300 ) return false   
        this.secretCodes = this.secretCodes.filter( e => (e.code != code && e.email != email) )
        return true
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    private async cleanSecretCodes() {
        var nowTime = new Date().getTime()
        this.secretCodes = this.secretCodes.filter( e => {
            var diff = (nowTime - e.date)/1000
            if ( diff <= 600 ) return e
        })
    }

}

