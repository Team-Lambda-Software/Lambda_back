import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { LogInEntryApplicationDto } from "../dto/log-in-entry.application.dto";
import { IJwtGenerator } from "../interface/jwt-generator.interface";
import { IEncryptor } from "../interface/encryptor.interface";
import { IInfraUserRepository } from "src/user/infraestructure/repositories/interfaces/orm-infra-user-repository.interface";

export class LogInUserApplicationService implements IApplicationService<LogInEntryApplicationDto, any> { 
    
    private readonly userRepository: IInfraUserRepository
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor; 

    constructor(
        userRepository: IInfraUserRepository,
        tokenGenerator: IJwtGenerator<string>,
        encryptor: IEncryptor
    ){
        this.userRepository = userRepository
        this.tokenGenerator = tokenGenerator,
        this.encryptor = encryptor        
    }
    
    async execute(logInDto: LogInEntryApplicationDto): Promise<Result<any>> {
        const findResult = await this.userRepository.findUserByEmail( logInDto.email )
        if ( !findResult.isSuccess() ) return Result.fail( new Error('Email no registrado'), 500, 'Email no registrado' )
        const userResult = await findResult.Value
        const checkPassword = await this.encryptor.comparePlaneAndHash(logInDto.password, userResult.password)
        if (!checkPassword) return Result.fail( new Error('Contraseña incorrecta'), 500, 'Contraseña incorrecta' )
        const token = this.tokenGenerator.generateJwt( userResult.id )   
        const answer = {
            token: token,
            type: userResult.type,
            user: {
                id: userResult.id,
                email: userResult.email,
                name: userResult.name,
                phone: userResult.phone,
            }               
        }
        return Result.success( answer , 200)
    }
    
    get name(): string { return this.constructor.name }
}