import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { SaveTokenAddressEntryApplicationDto } from "../dto/save-token-address-entry.application";
import { INotificationAddressRepository } from "../interfaces/notification-address-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { OrmNotificationAddress } from "src/notification/infraestructure/entities/orm-entities/orm-notification-address";

export class SaveTokenAddressApplicationService implements IApplicationService<SaveTokenAddressEntryApplicationDto, any> {
        
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly uuidGenerator: IdGenerator<string>
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
        uuidGenerator: IdGenerator<string>,
    ){
        this.notiAddressRepository = notiAddressRepository
        this.uuidGenerator = uuidGenerator
    }
    
    async execute(saveTokenDto: SaveTokenAddressEntryApplicationDto): Promise<Result<any>> {
        const saveResult = await this.notiAddressRepository.saveNotificationAddress(
            OrmNotificationAddress.create( await this.uuidGenerator.generateId(), saveTokenDto.userId, saveTokenDto.token )
        )    
        if ( !saveResult.isSuccess() ) return Result.fail( new Error('Something went wrong'), 500, 'Something went wrong' )
        const answer = { userId: saveTokenDto.userId, address: saveTokenDto.token }           
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }

}