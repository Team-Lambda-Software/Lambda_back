import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { SaveTokenAddressEntryApplicationDto } from "../dto/save-token-address-entry.application";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { NotificationAddress } from "../../domain/entities/notification-address";
import { NotificationAlert } from "../../domain/entities/notification-alert";
import { INotificationAddressRepository } from "../../domain/repositories/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../domain/repositories/notification-alert-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { PushNotificationDto } from "src/common/Application/notifier/dto/token-notification.dto";

export class SaveTokenAddressApplicationService implements IApplicationService<SaveTokenAddressEntryApplicationDto, any> {
        
    private readonly userRepository: IUserRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly uuidGenerator: IdGenerator<string>
    private pushNotifier: INotifier
    
    constructor(
        userRepository: IUserRepository,
        notiAlertRepository: INotificationAlertRepository,
        notiAddressRepository: INotificationAddressRepository,
        uuidGenerator: IdGenerator<string>,
        pushNotifier: INotifier
    ){
        this.userRepository = userRepository
        this.notiAlertRepository = notiAlertRepository
        this.notiAddressRepository = notiAddressRepository
        this.uuidGenerator = uuidGenerator
        this.pushNotifier = pushNotifier
    }
    
    async execute(saveTokenDto: SaveTokenAddressEntryApplicationDto): Promise<Result<any>> {
        const findResult = await this.userRepository.findUserByEmail(saveTokenDto.email)
        if ( !findResult.isSuccess() ) 
            return Result.fail( new Error('Email no registrado'), 500, 'Email no registrado' )

        const saveResult = await this.notiAddressRepository.saveNotificationAddress(
            NotificationAddress.create(
                await this.uuidGenerator.generateId(),
                findResult.Value.Id,
                saveTokenDto.token
            )
        )    

        if ( !saveResult.isSuccess() ) 
            return Result.fail( new Error('Error al registrar token'), 500, 'Error al registrar token' )
    
        const pushMessage:PushNotificationDto = {
            token: saveTokenDto.token,
            notification: {
                title: 'Welcome',
                body: 'Be welcome my dear ' + findResult.Value.Name
            }
        }
        
        const resultNotifier = await this.pushNotifier.sendNotification( pushMessage )
        
        if ( resultNotifier.isSuccess() ) 
            this.notiAlertRepository.saveNotificationAlert(
                NotificationAlert.create(
                    await this.uuidGenerator.generateId(),
                    findResult.Value.Id,
                    "Welcome",
                    'be Welcome my dear ' + findResult.Value.Name,
                    false,
                    new Date()
                )
            )
        const answer = {
            email: saveTokenDto.email,
            address: saveTokenDto.token,
            message: 'Save token successfull'
        }           
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }
}