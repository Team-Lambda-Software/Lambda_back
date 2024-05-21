import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { GetNotificationsUserEntryApplicationDto } from "../dto/get-notifications-user-by-email.application";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { INotificationAlertRepository } from "../../domain/repositories/notification-alert-repository.interface";

export class GetNotificationsUserByEmailApplicationService 
    implements IApplicationService<GetNotificationsUserEntryApplicationDto, any> {
    
    private readonly userRepository: IUserRepository
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        userRepository: IUserRepository,
        notiAlertRepository: INotificationAlertRepository
    ){
        this.userRepository = userRepository
        this.notiAlertRepository = notiAlertRepository
    }
    
    async execute(getDto: GetNotificationsUserEntryApplicationDto): Promise<Result<any>> {
        const findResult = await this.userRepository.findUserByEmail(getDto.email)
        if ( !findResult.isSuccess() ) 
            return Result.fail( new Error('Email no registrado'), 500, 'Email no registrado' )
        
        const alertResult = await this.notiAlertRepository.findAllByIdUser(findResult.Value.Id)
        if ( !alertResult.isSuccess() ) 
            return Result.fail( new Error('Sin alertas registradas'), 500, 'Sin alertas registradas' )
        const answer = {
            email: getDto.email,
            notifications: alertResult.Value
        }           
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }
}