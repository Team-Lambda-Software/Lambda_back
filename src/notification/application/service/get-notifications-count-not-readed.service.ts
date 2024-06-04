import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { INotificationAlertRepository } from "src/notification/infraestructure/repositories/interfaces/notification-alert-repository.interface"

export class GetNumberNotificationNotSeenByUserApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }
    async execute(data: ApplicationServiceEntryDto): Promise<Result<any>> {
        const findNotifyResult= await this.notiAlertRepository.findAllByIdUserNotReaded(data.userId)
        if (!findNotifyResult.isSuccess())
            return Result.fail( new Error('Sin notificaciones registradas'), 500, 'Sin notificaciones registradas' );
        let Answer = {
            count: findNotifyResult.Value.length
        }
        return(Result.success(Answer,200) )
    }
    get name(): string { return this.constructor.name }
    
}