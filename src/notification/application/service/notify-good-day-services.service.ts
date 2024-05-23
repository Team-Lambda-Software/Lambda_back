import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { INotificationAddressRepository } from "../../domain/repositories/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../domain/repositories/notification-alert-repository.interface";
import { NotificationAlert } from "../../domain/entities/notification-alert";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { PushNotificationDto } from "src/common/Application/notifier/dto/token-notification.dto";

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
        if ( !findResult.isSuccess() )
            return Result.fail( new Error('Sin tokens registrados'), 500, 'Sin tokens registrados' )
        
        const listTokens = findResult.Value
            listTokens.forEach( async e => {  
                try {

                    const pushMessage:PushNotificationDto = {
                        token: e.Token,
                        notification: {
                            title: 'Good ney day!',
                            body: 'be Happy, my budy'
                        }
                    }    

                    const result = await this.pushNotifier.sendNotification( pushMessage )
                    if ( result.isSuccess() ) {
                        this.notiAlertRepository.saveNotificationAlert(
                            NotificationAlert.create(
                                await this.uuidGenerator.generateId(),
                                e.UserId,
                                "Good new Day!",
                                'be Happy, my budy'
                            )
                        )
                    }
                } catch (e) {}
            })
        return Result.success('good day push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}