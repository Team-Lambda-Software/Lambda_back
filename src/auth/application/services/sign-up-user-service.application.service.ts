import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { SignUpEntryDto } from "../dto/entry/sign-up-entry.application.dto";
import { SignUpResponseDto } from "../dto/response/sign-up-response.application.dto";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { UserId } from "src/user/domain/value-objects/user-id";
import { UserName } from "src/user/domain/value-objects/user-name";
import { UserPhone } from "src/user/domain/value-objects/user-phone";
import { UserEmail } from "src/user/domain/value-objects/user-email";

export class SignUpUserApplicationService implements IApplicationService<SignUpEntryDto, SignUpResponseDto> {
    
    private readonly userRepository: IUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly eventHandler: IEventHandler
        
    constructor(
        eventHandler: IEventHandler,
        userRepository: IUserRepository,
        uuidGenerator: IdGenerator<string>,
    ){
        this.userRepository = userRepository
        this.uuidGenerator = uuidGenerator
        this.eventHandler = eventHandler
    }
    
    async execute(signUpDto: SignUpEntryDto): Promise<Result<any>> {
        
        const idUser = await this.uuidGenerator.generateId()

        const create = User.create(
            UserId.create(idUser), 
            UserName.create(signUpDto.name), 
            UserPhone.create(signUpDto.phone), 
            UserEmail.create(signUpDto.email) 
        )
        const userResult = await this.userRepository.saveUserAggregate( create )
        if ( !userResult.isSuccess() ) return Result.fail( userResult.Error, userResult.StatusCode, userResult.Message )        
        
        await this.eventHandler.publish( create.pullEvents() )

        const answer = { 
            id: idUser,
            email: signUpDto.email,
            name: signUpDto.name 
        }
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }
}