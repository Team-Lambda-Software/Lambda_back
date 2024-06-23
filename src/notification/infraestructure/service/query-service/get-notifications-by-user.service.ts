import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetNotificationsUserDtoEntryAplicationDto } from "./dto/entry/get-notifications-by-user.aplication.dto"
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface"
import { GetNotificationByIdDtoResponse } from "./dto/response/get-notification-by-id-response.dto"

export class GetManyNotificationByUserInfraService implements IApplicationService<ApplicationServiceEntryDto, GetNotificationByIdDtoResponse[]> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }

    async execute(data: GetNotificationsUserDtoEntryAplicationDto): Promise<Result<GetNotificationByIdDtoResponse[]>> {
        let {userId,...dataPagination}=data;
        dataPagination.page = dataPagination.page * dataPagination.perPage - dataPagination.perPage
        const notificationResult= await this.notiAlertRepository.findManyNotificationsByIdUser(userId,dataPagination)
        if (!notificationResult.isSuccess()) return Result.fail( new Error('Something went wrong'), 500, 'Something went wrong' );
        const result = []
        notificationResult.Value.forEach( e => result.push(
            {
                title: e.title,
                body: e.body,
                id: e.alert_id,
                date: e.date
            }
        ))
        return Result.success(result, 200)
    }
    get name(): string { return this.constructor.name }
}