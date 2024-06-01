import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { INotificationAlertRepository } from "src/notification/domain/repositories/notification-alert-repository.interface"
import { GetNotificationUserEntryAplicationDto } from "../dto/get-notification-by-notification-id.aplication"

export class GetNotificationByIdApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }
    async execute(data: GetNotificationUserEntryAplicationDto): Promise<Result<any>> {
        const notificationResult= await this.notiAlertRepository.findNotificationById(data.userId, data.notificationId)
        if (!notificationResult.isSuccess())
            return Result.fail( new Error('Sin notificaciones asociadas'), 500, 'Sin notificaciones asociadas' );
        return (notificationResult)
    }

    get name(): string { return this.constructor.name }

}