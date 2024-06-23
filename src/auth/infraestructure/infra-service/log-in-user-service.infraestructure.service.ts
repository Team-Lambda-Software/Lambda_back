import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IJwtGenerator } from "../../../common/Application/jwt-generator/jwt-generator.interface";
import { IEncryptor } from "../../../common/Application/encryptor/encryptor.interface";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { LogInEntryDto } from "./dto/entry/log-in-entry.infraestructure.dto";
import { LogInResponseDto } from "./dto/response/log-in-response.dto";

export class LogInUserInfraService implements IApplicationService<LogInEntryDto, LogInResponseDto> { 
    
    private readonly userRepository: IInfraUserRepository
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor; 

    constructor(
        userRepository: IInfraUserRepository,
        tokenGenerator: IJwtGenerator<string>,
        encryptor: IEncryptor,
    ){
        this.userRepository = userRepository
        this.tokenGenerator = tokenGenerator,
        this.encryptor = encryptor 
    }
    
    async execute(logInDto: LogInEntryDto): Promise<Result<LogInResponseDto>> {
        const findResult = await this.userRepository.findUserByEmail( logInDto.email )
        if ( !findResult.isSuccess() ) return Result.fail( new Error('Email not registered'), 403, 'Email not registered' )
        const userResult = await findResult.Value
        const checkPassword = await this.encryptor.comparePlaneAndHash(logInDto.password, userResult.password)
        if (!checkPassword) return Result.fail( new Error('Incorrect password'), 400, 'Incorrect password' )
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
        return Result.success( answer, 200)
    }
    
    get name(): string { return this.constructor.name }
}