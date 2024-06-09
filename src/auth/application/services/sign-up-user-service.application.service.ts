import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { SignUpEntryApplicationDto } from "../dto/sign-up-entry.application.dto";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { IEncryptor } from "../interface/encryptor.interface";
import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

export class SignUpUserApplicationService implements IApplicationService<SignUpEntryApplicationDto, any> {
    
    private readonly infraUserRepository: IInfraUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly encryptor: IEncryptor; 
    private readonly emailSender: IEmailSender; 

    constructor(
        infraUserRepository: IInfraUserRepository,
        uuidGenerator: IdGenerator<string>,
        encryptor: IEncryptor,
    ){
        this.infraUserRepository = infraUserRepository
        this.uuidGenerator = uuidGenerator
        this.encryptor = encryptor
    }
    
    async execute(signUpDto: SignUpEntryApplicationDto): Promise<Result<any>> {
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
        if ( !userResult.isSuccess() ) return Result.fail( userResult.Error, 500, 'Something went wrong signing up user' )        
        const answer = { 
            id: userResult.Value.id,
            email: userResult.Value.email,
            name: userResult.Value.name 
        }
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }
}