import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { INotificationAddressRepository } from "../../repositories/interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface";
import { IPushSender } from "src/common/Application/push-sender/push-sender.interface";
import { PushNotificationDto } from "src/common/Application/push-sender/dto/token-notification.dto";
import { NewPublicationPushDto } from "./dto/entry/new-publication-push-entry.dto";
import { TrainerQueryRepository } from "src/trainer/infraestructure/repositories/trainer-query-repository.interface"

export class NewPublicationPushInfraService implements IApplicationService<NewPublicationPushDto, any> {
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly trainerRepository: TrainerQueryRepository
    private uuidGenerator: IdGenerator<string>
    private pushNotifier: IPushSender
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        uuidGenerator: IdGenerator<string>,
        pushNotifier: IPushSender,
        trainerRepository: TrainerQueryRepository
    ){
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.pushNotifier = pushNotifier
        this.trainerRepository = trainerRepository
    }
    
    async execute(notifyDto: NewPublicationPushDto): Promise<Result<any>> {
        const findResult = await this.notiAddressRepository.findAllTokens()
        if ( !findResult.isSuccess() ) return Result.fail( findResult.Error, findResult.StatusCode, findResult.Message )
        
        const trainerResult = await this.trainerRepository.findTrainerById(notifyDto.trainerId)
        if ( !trainerResult.isSuccess() ) return Result.fail( trainerResult.Error, trainerResult.StatusCode, trainerResult.Message )
            
        const trainer = trainerResult.Value
        const listTokens = findResult.Value
        const pushTitle = trainer.first_name + ' '+ trainer.first_last_name + ' has published a new ' + notifyDto.publicationType
        const pushBody = 'This new fantastic ' + notifyDto.publicationType + ' is ' + notifyDto.publicationName

        listTokens.forEach( async e => {  
            this.notiAlertRepository.saveNotificationAlert({
                alert_id: await this.uuidGenerator.generateId(), 
                user_id: e.user_id, 
                title: pushTitle, 
                body: pushBody, 
                date: new Date(), 
                user_readed: false 
            })
            const pushMessage:PushNotificationDto = { token: e.token, notification: { title: pushTitle, body: pushBody } }    
            const result = await this.pushNotifier.sendNotificationPush( pushMessage )
            //if ( result.isSuccess() ) {}
        })
        return Result.success('good day push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}