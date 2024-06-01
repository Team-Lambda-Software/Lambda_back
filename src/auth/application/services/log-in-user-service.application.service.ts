import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
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
        if ( !findResult.isSuccess() ) 
            return Result.fail( new Error('Correo electrónico no registrado'), 500, 'Correo electrónico no registrado' )
        const userResult = await findResult.Value
        const checkPassword = await this.encryptor.comparePlaneAndHash(logInDto.password, userResult.Password)
        if (!checkPassword) 
            return Result.fail( new Error('Contraseña incorrecta'), 500, 'Contraseña incorrecta' )
        const token = this.tokenGenerator.generateJwt( userResult.Id )   
        const answer = {
            token: token,
            type: userResult.Type,
            user: {
                id: userResult.Id,
                email: userResult.Email,
                name: userResult.Name,
                phone: userResult.Phone,
            }               
        }
        return Result.success(answer, 200)
    }
    
    get name(): string { return this.constructor.name }
}