import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { SaveTokenAddressEntryApplicationDto } from "../dto/save-token-address-entry.application";
import { INotificationAddressRepository } from "../../infraestructure/repositories/interfaces/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../infraestructure/repositories/interfaces/notification-alert-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { PushNotificationDto } from "src/common/Application/notifier/dto/token-notification.dto";
import { OrmNotificationAddress } from "src/notification/infraestructure/entities/orm-entities/orm-notification-address";
import { OrmNotificationAlert } from "src/notification/infraestructure/entities/orm-entities/orm-notification-alert";
import { IInfraUserRepository } from "src/user/infraestructure/repositories/interfaces/orm-infra-user-repository.interface";

export class SaveTokenAddressApplicationService implements IApplicationService<SaveTokenAddressEntryApplicationDto, any> {
        
    private readonly userRepository: IInfraUserRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly uuidGenerator: IdGenerator<string>
    private pushNotifier: INotifier
    
    constructor(
        userRepository: IInfraUserRepository,
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
            OrmNotificationAddress.create(
                await this.uuidGenerator.generateId(),
                findResult.Value.id,
                saveTokenDto.token
            )
        )    

        if ( !saveResult.isSuccess() ) 
            return Result.fail( new Error('Error al registrar token'), 500, 'Error al registrar token' )
    
        const pushMessage:PushNotificationDto = {
            token: saveTokenDto.token,
            notification: {
                title: 'Welcome',
                body: 'Be welcome my dear ' + findResult.Value.name
            }
        }
        
        const resultNotifier = await this.pushNotifier.sendNotification( pushMessage )
        
        if ( resultNotifier.isSuccess() ) 
            this.notiAlertRepository.saveNotificationAlert(
                OrmNotificationAlert.create(
                    await this.uuidGenerator.generateId(),
                    findResult.Value.id,
                    "Welcome",
                    'be Welcome my dear ' + findResult.Value.name,
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