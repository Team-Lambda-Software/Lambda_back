import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { INotificationAddressRepository } from "../../repositories/interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface";

export class NotifyGoodDayInfraService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private uuidGenerator: IdGenerator<string>
    private pushNotifier: INotifier
    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
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
            this.notiAlertRepository.saveNotificationAlert({
                alert_id: await this.uuidGenerator.generateId(), 
                user_id: e.user_id, 
                title: "Good new Day!", 
                body: 'be Happy, my budy', 
                date: new Date(), 
                user_readed: false 
            })
            console.log(e)
            //const pushMessage:PushNotificationDto = { token: e.token, notification: { title: 'Good new day!', body: 'be Happy, my budy' } }    
            //const result = await this.pushNotifier.sendNotification( pushMessage )
            //if ( result.isSuccess() ) {}
        })
        return Result.success('good day push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}