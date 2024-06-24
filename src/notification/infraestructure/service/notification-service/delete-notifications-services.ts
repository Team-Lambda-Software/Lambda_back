import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface";

export class DeleteNotificationsInfraService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAlertRepository: INotificationAlertRepository
    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }
    
    async execute(notifyDto: ApplicationServiceEntryDto): Promise<Result<any>> {
        this.notiAlertRepository.deleteNotificationsByUser( notifyDto.userId )
        return Result.success('delete notifications', 200)
    }
   
    get name(): string { return this.constructor.name }
}