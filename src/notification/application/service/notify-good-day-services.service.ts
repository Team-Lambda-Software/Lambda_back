import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { INotificationAddressRepository } from "../../domain/repositories/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../domain/repositories/notification-alert-repository.interface";
import { GoodDayNotifier } from "src/notification/infraestructure/notifier/good-day-notifier";
import { NotificationAlert } from "../../domain/entities/notification-alert";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";

export class NotifyGoodDayApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private uuidGenerator: IdGenerator<string>
    private goodDayNotifier = new GoodDayNotifier()

    constructor(
        notiAlertRepository: INotificationAlertRepository,
        notiAddressRepository: INotificationAddressRepository,
        uuidGenerator: IdGenerator<string>
    ){
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
    }
    
    async execute(notifyDto: ApplicationServiceEntryDto): Promise<Result<any>> {
        const findResult = await this.notiAddressRepository.findAllTokens()
        if ( !findResult.isSuccess() )
            return Result.fail( new Error('Sin tokens registrados'), 500, 'Sin tokens registrados' )
        
        const listTokens = findResult.Value
            listTokens.forEach( async e => {  
                try {
                    const result = await this.goodDayNotifier.sendNotification( { token: e.Token } )
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