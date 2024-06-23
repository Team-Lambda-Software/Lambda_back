import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetNotificationUserEntryAplicationDto } from "./dto/entry/get-notification-by-notification-id.aplication"
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface"
import { GetNotificationByIdDtoResponse } from "./dto/response/get-notification-by-id-response.dto"

export class GetNotificationByIdInfraService implements IApplicationService<ApplicationServiceEntryDto, GetNotificationByIdDtoResponse> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }
    async execute(data: GetNotificationUserEntryAplicationDto): Promise<Result<GetNotificationByIdDtoResponse>> {
        const notificationResult= await this.notiAlertRepository.findNotificationById(data.userId, data.notificationId)
        if (!notificationResult.isSuccess()) return Result.fail( new Error('Something went wrong'), 500, 'Something went wrong' )
        const noti = notificationResult.Value
        noti.user_readed = true
        const result = await this.notiAlertRepository.saveNotificationAlert(noti)
        const answer = {
            title: noti.title,
            body: noti.body,
            date: noti.date,
            id: noti.alert_id
        }
        return Result.success(answer, 200)
    }

    get name(): string { return this.constructor.name }

}