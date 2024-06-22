import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { IEncryptor } from "../../../common/Application/encryptor/encryptor.interface";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { SignUpEntryDto } from "../dto/entry/sign-up-entry.application.dto";
import { SignUpResponseDto } from "../dto/response/sign-up-response.application.dto";

export class SignUpUserApplicationService implements IApplicationService<SignUpEntryDto, SignUpResponseDto> {
    
    private readonly infraUserRepository: IInfraUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly encryptor: IEncryptor; 
    private readonly eventHandler: IEventHandler

    constructor(
        eventHandler: IEventHandler,
        infraUserRepository: IInfraUserRepository,
        uuidGenerator: IdGenerator<string>,
        encryptor: IEncryptor,
    ){
        this.infraUserRepository = infraUserRepository
        this.uuidGenerator = uuidGenerator
        this.encryptor = encryptor
        this.eventHandler = eventHandler
    }
    
    async execute(signUpDto: SignUpEntryDto): Promise<Result<any>> {
        const findResult = await this.infraUserRepository.findUserByEmail( signUpDto.email )
        if ( findResult.isSuccess() ) return Result.fail( new Error('Email registered'), 403, 'Email registered')
        const idUser = await this.uuidGenerator.generateId()
        const plainToHash = await this.encryptor.hashPassword(signUpDto.password)
        const userResult = await this.infraUserRepository.saveOrmUser( 
            OrmUser.create(
                idUser,
                signUpDto.phone,
                signUpDto.name,
                undefined,
                signUpDto.email,
                plainToHash,
                signUpDto.type    
            )
        )
        if ( !userResult.isSuccess() ) return Result.fail( new Error('Something went wrong signing up user'), 500, 'Something went wrong signing up user' )        
        const answer = { 
            id: userResult.Value.id,
            email: userResult.Value.email,
            name: userResult.Value.name 
        }
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }
}