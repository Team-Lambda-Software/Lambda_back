import { BadRequestException, Body, Controller, Get, Post, Put } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Inject } from "@nestjs/common";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { JwtGenerator } from "../jwt/jwt-generator";
import { EncryptorBcrypt } from "../../../common/Infraestructure/encryptor/encryptor-bcrypt";
import { SignUpUserApplicationService } from "src/auth/application/services/sign-up-user-service.application.service";
import { JwtService } from "@nestjs/jwt";
import { UpdatePasswordSender } from "src/common/Infraestructure/utils/email-sender/update-password-sender.infraestructure";
import { SecretCodeGenerator } from "../../../common/Infraestructure/secret-code-generator/secret-code-generator";
import { GetCodeUpdatePasswordUserInfraService } from "src/auth/infraestructure/infra-service/get-code-update-password-service.infra.service";
import { WelcomeSender } from "src/common/Infraestructure/utils/email-sender/welcome-sender.infraestructure";
import { JwtAuthGuard } from "../jwt/decorator/jwt-auth.guard";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { GetUser } from "../jwt/decorator/get-user.param.decorator";
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { ChangePasswordUserInfraService } from "../infra-service/change-password-user-service.infra.service";
import { ChangePasswordEntryInfraDto } from "./dto/entry/change-password-entry.dto";
import { CodeValidateEntryInfraDto } from "./dto/entry/code-validate-entry.dto";
import { ForgetPasswordEntryInfraDto } from "./dto/entry/forget-password-entry.dto";
import { LogInUserEntryInfraDto } from "./dto/entry/log-in-user-entry.dto";
import { SignUpUserEntryInfraDto } from "./dto/entry/sign-up-user-entry.dto";
import { ChangePasswordSwaggerResponseDto } from "./dto/response/change-password-swagger-response.dto";
import { CurrentUserSwaggerResponseDto } from "./dto/response/current-user-swagger-response.dto";
import { ForgetPasswordSwaggerResponseDto } from "./dto/response/forget-password-swagger-response.dto";
import { LogInUserSwaggerResponseDto } from "./dto/response/log-in-user-swagger-response.dto";
import { SignUpUserSwaggerResponseDto } from "./dto/response/sign-up-user-swagger-response.dto";
import { ValidateCodeForgetPasswordSwaggerResponseDto } from "./dto/response/val-code-swagger-response.dto";
import { EventBus } from "src/common/Infraestructure/event-bus/event-bus";
import { LogInUserInfraService } from "../infra-service/log-in-user-service.infraestructure.service";
import { IJwtGenerator } from "src/common/Application/jwt-generator/jwt-generator.interface";
import { IEncryptor } from "src/common/Application/encryptor/encryptor.interface";
import { UserCreated } from "src/user/domain/events/user-created-event";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper";
import { OdmUserRepository } from "src/user/infraestructure/repositories/odm-repository/odm-user-repository";
import { InjectModel } from "@nestjs/mongoose";
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";
import { InfraUserQuerySynchronizer } from "src/user/infraestructure/query-synchronizer/user-infra-query-synchronizer";
import { AzureBufferImageHelper } from "src/common/Infraestructure/azure-file-getter/azure-get-file";
import { BufferBase64ImageTransformer } from "src/common/Infraestructure/image-transformer/buffer-base64-image-transformer";
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";
import { OrmAccountRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-account-repository";
import { OdmAccountRepository } from "src/user/infraestructure/repositories/odm-repository/odm-account-repository";
import { SecurityDecorator } from "src/common/Application/application-services/decorators/decorators/security-decorator/security.decorator";
import { UserType } from "src/user/infraestructure/entities/enum-type-user/user-type.enum";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>
    private readonly encryptor: IEncryptor

    private readonly ormAccountRepository: IAccountRepository<OrmUser>
    private readonly odmAccountRepository: IAccountRepository<OdmUserEntity>
    private readonly userRepository: IUserRepository
    private readonly syncroInfraUser: InfraUserQuerySynchronizer

    private secretCodes = []
    
    constructor(
        @InjectModel('User') private userModel: Model<OdmUserEntity>,
        @Inject('DataSource') private readonly dataSource: DataSource,
        private jwtAuthService: JwtService
    ) {
        this.logger = new Logger('AuthController')
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()

        this.syncroInfraUser = new InfraUserQuerySynchronizer( new OdmUserRepository( userModel ), userModel )
        this.userRepository = new OrmUserRepository( new OrmUserMapper(), dataSource )
        this.odmAccountRepository = new OdmAccountRepository( userModel )
        this.ormAccountRepository = new OrmAccountRepository( dataSource )
    }
    
    @Get('current')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Obtener usuario actual', type: CurrentUserSwaggerResponseDto })
    @ApiBearerAuth()
    async currentUser( @GetUser() user ) {  
        
        let image = undefined
        if (user.image != null){
            const imageTransformer = new BufferBase64ImageTransformer()
            const imageGetter = new AzureBufferImageHelper()
            const imageResult = await imageGetter.getFile( user.image.split( '/' ).pop() )
            if ( !imageResult.isSuccess() ) return { error: imageResult.Message }
            image = await imageTransformer.transformFile(imageResult.Value)
            if ( !image.isSuccess() ) return { error: image.Message }
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            image: image
        } 
    }

    @Post('login')
    @ApiOkResponse({ description: 'Iniciar sesion de usuario', type: LogInUserSwaggerResponseDto })
    async logInUser(@Body() logInDto: LogInUserEntryInfraDto) {
        const data = { userId: 'none', ...logInDto } 
        const logInUserService = new ExceptionDecorator( 
            new LoggingDecorator(
                new LogInUserInfraService(
                    this.ormAccountRepository,
                    this.tokenGenerator,
                    this.encryptor
                ), 
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await logInUserService.execute(data)).Value
    }
    
    @Post('register')
    @ApiOkResponse({ description: 'Registrar un nuevo usuario en el sistema', type: SignUpUserSwaggerResponseDto })
    async signUpUser(@Body() signUpDto: SignUpUserEntryInfraDto) {
        var data = { userId: 'none', ...signUpDto }
        if ( !data.type ) data = { type: 'CLIENT', ...data }

        const plainToHash = await this.encryptor.hashPassword(signUpDto.password)

        const emailSender = new WelcomeSender()
        emailSender.setVariables( { firstname: signUpDto.name } )
        
        const eventBus = EventBus.getInstance()
        const suscribe = eventBus.subscribe('UserCreated', async (event: UserCreated) => {
            const ormUser = OrmUser.create( event.userId.Id, event.userPhone.Phone, event.userName.Name, null, event.userEmail.Email, plainToHash, data.type, )
            this.syncroInfraUser.execute( ormUser )
            this.ormAccountRepository.saveUser( ormUser )
            emailSender.sendEmail( signUpDto.email, signUpDto.name )
        })

        const signUpApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new SignUpUserApplicationService(
                    eventBus,
                    this.userRepository,
                    this.uuidGenerator
                ), 
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        const resultService = (await signUpApplicationService.execute({
            userId: 'none',
            email: data.email,
            name: data.name,
            phone: data.phone,
        }))
        return { id: resultService.Value.id }
    }
    
    @Post('forget/password')
    @ApiOkResponse({ description: 'Obtener codigo temporal para confirmar usuario', type: ForgetPasswordSwaggerResponseDto })
    async getCodeForUpdatePasswordUser(@Body() getCodeUpdateDto: ForgetPasswordEntryInfraDto ) {
        this.cleanSecretCodes()
        const data = { userId: 'none', ...getCodeUpdateDto, }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new GetCodeUpdatePasswordUserInfraService(
                    this.ormAccountRepository,
                    new UpdatePasswordSender(),
                    new SecretCodeGenerator(),
                ), 
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        const result = await service.execute(data)
        this.secretCodes = this.secretCodes.filter( e => e.email != result.Value.email )
        this.secretCodes.push( result.Value )
        return { date: result.Value.date }
    }

    @Put('change/password')
    @ApiOkResponse({ description: 'Cambiar la contraseña del usuario', type: ChangePasswordSwaggerResponseDto })
    async changePasswordUser(@Body() updatePasswordDto: ChangePasswordEntryInfraDto ) {     
        this.cleanSecretCodes()
        const result = this.signCode(updatePasswordDto.code, updatePasswordDto.email)  
        if ( !result ) throw new BadRequestException('Invalid secret code')
        const data = { userId: 'none',  ...updatePasswordDto }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new ChangePasswordUserInfraService(
                    this.ormAccountRepository,
                    this.encryptor,
                    this.odmAccountRepository
                ), 
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        await service.execute(data)
    }
    
    @Post('code/validate')
    @ApiOkResponse({  description: 'Validar codigo de cambio de contraseña', type: ValidateCodeForgetPasswordSwaggerResponseDto })
    async validateCodeForgetPassword( @Body() codeValDto: CodeValidateEntryInfraDto ) {  
        if ( !this.validateCode( codeValDto.code, codeValDto.email ) ) throw new BadRequestException('Invalid secret code')
    }

    private validateCode( code: string, email: string ) {
        var nowTime = new Date().getTime()
        var search = this.secretCodes.filter( e => (e.code == code && e.email == email) )
        if ( search.length == 0 ) return false
        if ( (nowTime - search[0].date)/1000 >= 300 ) return false   
        return true
    }

    private signCode( code: string, email: string ) {
        var nowTime = new Date().getTime()
        var search = this.secretCodes.filter( e => (e.code == code && e.email == email) )
        if ( search.length == 0 ) return false
        if ( (nowTime - search[0].date)/1000 >= 300 ) return false   
        this.secretCodes = this.secretCodes.filter( e => (e.code != code && e.email != email) )
        return true
    }

    private async cleanSecretCodes() {
        var nowTime = new Date().getTime()
        this.secretCodes = this.secretCodes.filter( e => {
            var diff = (nowTime - e.date)/1000
            if ( diff <= 600 ) return e
        })
    }

}

