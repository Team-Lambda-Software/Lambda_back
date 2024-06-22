import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { SaveTokenAddressEntryApplicationDto } from "./dto/entry/save-token-address-entry.application";
import { SaveTokenDtoResponse } from "./dto/response/save-token-response";
import { OdmNotificationAddressRepository } from "../../repositories/address-notification/odm-notification-address-repository";

export class SaveTokenAddressInfraService implements IApplicationService<SaveTokenAddressEntryApplicationDto, SaveTokenDtoResponse> {
        
    private readonly notiAddressRepository: OdmNotificationAddressRepository
    
    constructor(
        notiAddressRepository: OdmNotificationAddressRepository,
    ){
        this.notiAddressRepository = notiAddressRepository
    }
    
    async execute(saveTokenDto: SaveTokenAddressEntryApplicationDto): Promise<Result<any>> {
        const saveResult = await this.notiAddressRepository.saveNotificationAddress({
            token: saveTokenDto.token, 
            user_id: saveTokenDto.userId
        })    
        return Result.success({}, 200)
    }
   
    get name(): string { return this.constructor.name }

}