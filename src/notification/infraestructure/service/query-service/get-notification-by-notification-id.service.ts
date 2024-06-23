import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetNotificationUserEntryAplicationDto } from "./dto/entry/get-notification-by-notification-id.aplication"
import { OdmNotificationAlertEntity } from "../../entities/odm-entities/odm-notification-alert.entity"
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface"

export class GetNotificationByIdInfraService implements IApplicationService<ApplicationServiceEntryDto, OdmNotificationAlertEntity> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }
    async execute(data: GetNotificationUserEntryAplicationDto): Promise<Result<OdmNotificationAlertEntity>> {
        const notificationResult= await this.notiAlertRepository.findNotificationById(data.userId, data.notificationId)
        if (!notificationResult.isSuccess()) return Result.fail( new Error('Something went wrong'), 500, 'Something went wrong' );
        return (notificationResult)
    }

    get name(): string { return this.constructor.name }

}