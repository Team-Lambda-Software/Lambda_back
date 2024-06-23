import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetNotificationsUserDtoEntryAplicationDto } from "./dto/entry/get-notifications-by-user.aplication.dto"
import { OdmNotificationAlertEntity } from "../../entities/odm-entities/odm-notification-alert.entity"
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface"

export class GetManyNotificationByUserInfraService implements IApplicationService<ApplicationServiceEntryDto, OdmNotificationAlertEntity[]> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }

    async execute(data: GetNotificationsUserDtoEntryAplicationDto): Promise<Result<OdmNotificationAlertEntity[]>> {
        let {userId,...dataPagination}=data;
        dataPagination.page = dataPagination.page * dataPagination.perPage - dataPagination.perPage
        const notificationResult= await this.notiAlertRepository.findManyNotificationsByIdUser(userId,dataPagination)
        if (!notificationResult.isSuccess()) return Result.fail( new Error('Something went wrong'), 500, 'Something went wrong' );
        return notificationResult
    }
    get name(): string { return this.constructor.name }
}