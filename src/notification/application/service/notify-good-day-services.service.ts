import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { INotificationAddressRepository } from "../interfaces/notification-address-repository.interface";
import { INotificationAlertRepository } from "../interfaces/notification-alert-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { PushNotificationDto } from "src/common/Application/notifier/dto/token-notification.dto";
import { OrmNotificationAlert } from "src/notification/infraestructure/entities/orm-entities/orm-notification-alert";

export class NotifyGoodDayApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private uuidGenerator: IdGenerator<string>
    private pushNotifier: INotifier
    constructor(
        notiAlertRepository: INotificationAlertRepository,
        notiAddressRepository: INotificationAddressRepository,
        uuidGenerator: IdGenerator<string>,
        pushNotifier: INotifier
    ){
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.pushNotifier = pushNotifier
    }
    
    async execute(notifyDto: ApplicationServiceEntryDto): Promise<Result<any>> {
        const findResult = await this.notiAddressRepository.findAllTokens()
        if ( !findResult.isSuccess() ) return Result.fail( findResult.Error, findResult.StatusCode, findResult.Message )
        const listTokens = findResult.Value

        listTokens.forEach( async e => {  
            
            this.notiAlertRepository.saveNotificationAlert(
                OrmNotificationAlert.create( 
                    await this.uuidGenerator.generateId(), e.user_id, "Good new Day!", 'be Happy, my budy', false, new Date() )
            )
            
            try {
                const pushMessage:PushNotificationDto = { token: e.token, notification: { title: 'Good new day!', body: 'be Happy, my budy' } }    
                const result = await this.pushNotifier.sendNotification( pushMessage )
                //if ( result.isSuccess() ) {}
            } catch (e) { return Result.fail(new Error('Something went wrong'), 500, 'Something went wrong') }
        })
        return Result.success('good day push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}