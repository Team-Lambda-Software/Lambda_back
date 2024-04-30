import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { LogInEntryApplicationDto } from "../dto/log-in-entry.application.dto";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { IJwtGenerator } from "../interface/jwt-generator.interface";
import { IEncryptor } from "../interface/encryptor.interface";

export class LogInUserApplicationService implements IApplicationService<LogInEntryApplicationDto, any> { 
    
    private readonly userRepository: IUserRepository
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor; 

    constructor(
        userRepository: IUserRepository,
        tokenGenerator: IJwtGenerator<string>,
        encryptor: IEncryptor
    ){
        this.userRepository = userRepository
        this.tokenGenerator = tokenGenerator,
        this.encryptor = encryptor        
    }
    
    async execute(logInDto: LogInEntryApplicationDto): Promise<Result<any>> {
        const findResult = await this.userRepository.findUserByEmail( logInDto.email )
        if ( !findResult.isSuccess ) {
            return Result.fail(
                new Error('Correo electrónico ya registrado'),
                500,
                'Correo electrónico ya registrado'
            )
        }
        const userResult = findResult.Value
        const checkPassword = await this.encryptor.comparePlaneAndHash(logInDto.password, userResult.Password)
        if (!checkPassword) {
            return Result.fail(
                new Error('Contraseña inválida'),
                500,
                'Contraseña inválida'
            )
        }      
        const token = this.tokenGenerator.generateJwt( logInDto.email )   
        // TO-DO: RETURN DATAUSER, TOKEN
        return Result.success('Usuario logueado con éxito', 200)
    }
    
    get name(): string { return this.constructor.name }
}