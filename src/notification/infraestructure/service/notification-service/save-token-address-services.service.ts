import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { INotificationAddressRepository } from "../../../application/repositories/notification-address-repository.interface";import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { OrmNotificationAddress } from "src/notification/infraestructure/entities/orm-entities/orm-notification-address";
import { SaveTokenAddressEntryApplicationDto } from "./dto/entry/save-token-address-entry.application";
import { SaveTokenDtoResponse } from "./dto/response/save-token-response";

export class SaveTokenAddressInfraService implements IApplicationService<SaveTokenAddressEntryApplicationDto, SaveTokenDtoResponse> {
        
    private readonly notiAddressRepository: INotificationAddressRepository
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
    ){
        this.notiAddressRepository = notiAddressRepository
    }
    
    async execute(saveTokenDto: SaveTokenAddressEntryApplicationDto): Promise<Result<any>> {
        const saveResult = await this.notiAddressRepository.saveNotificationAddress(
            OrmNotificationAddress.create( saveTokenDto.userId, saveTokenDto.token )
        )    
        if ( !saveResult.isSuccess() ) return Result.fail( new Error('Something went wrong'), 500, 'Something went wrong' )
        const answer = { userId: saveTokenDto.userId, address: saveTokenDto.token }           
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }

}