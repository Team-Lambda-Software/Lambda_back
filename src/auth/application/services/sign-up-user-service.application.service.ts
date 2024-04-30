import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { SignUpEntryApplicationDto } from "../dto/sign-up-entry.application.dto";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { IJwtGenerator } from "../interface/jwt-generator.interface";
import { IEncryptor } from "../interface/encryptor.interface";

export class SignUpUserApplicationService implements IApplicationService<SignUpEntryApplicationDto, any> {
    
    private readonly userRepository: IUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor; 

    constructor(
        userRepository: IUserRepository,
        uuidGenerator: IdGenerator<string>,
        tokenGenerator: IJwtGenerator<string>,
        encryptor: IEncryptor
    ){
        this.userRepository = userRepository
        this.uuidGenerator = uuidGenerator
        this.tokenGenerator = tokenGenerator
        this.encryptor = encryptor
    }
    
    async execute(signUpDto: SignUpEntryApplicationDto): Promise<Result<any>> {
        const findResult = await this.userRepository.findUserByEmail( signUpDto.email )
        if ( !findResult.isSuccess ) {
            return Result.fail(
                new Error('Correo electrónico ya registrado'),
                500,
                'Correo electrónico ya registrado'
            )
        }
        const plainToHash = await this.encryptor.hashPassword(signUpDto.password)
        const userResult = await this.userRepository.saveUserAggregate(
            User.create(
                await this.uuidGenerator.generateId(),
                signUpDto.firstName,
                signUpDto.firstLastName,
                signUpDto.secondLastName,
                signUpDto.email,
                plainToHash
            )
        )
        if ( !userResult.isSuccess ) {
            return Result.fail(
                userResult.Error,
                500,
                'Error al registrar usuario'
            )
        }
        const token = this.tokenGenerator.generateJwt( signUpDto.email )  
        // TO-DO: RETURN DATAUSER, TOKEN
        return Result.success('Usuario registrado con éxito', 200)
    }
   
    get name(): string { return this.constructor.name }
}