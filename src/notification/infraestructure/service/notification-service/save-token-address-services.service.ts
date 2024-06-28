import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { SaveTokenAddressEntryDto } from "./dto/entry/save-token-address-entry.dto";
import { SaveTokenDtoResponse } from "./dto/response/save-token-response";
import { INotificationAddressRepository } from "../../repositories/interface/notification-address-repository.interface";

export class SaveTokenAddressInfraService implements IApplicationService<SaveTokenAddressEntryDto, SaveTokenDtoResponse> {
        
    private readonly notiAddressRepository: INotificationAddressRepository
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
    ){
        this.notiAddressRepository = notiAddressRepository
    }
    
    async execute(saveTokenDto: SaveTokenAddressEntryDto): Promise<Result<any>> {
        const saveResult = await this.notiAddressRepository.saveNotificationAddress({
            token: saveTokenDto.token, 
            user_id: saveTokenDto.userId
        })    
        return Result.success({}, 200)
    }
   
    get name(): string { return this.constructor.name }

}