import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetNotificationsUserDtoEntryAplicationDto } from "./dto/entry/get-notifications-by-user.aplication.dto"
import { OdmNotificationAlertRepository } from "../../repositories/alert-notification/odm-notification-alert-repository"
import { OdmNotificationAddressEntity } from "../../entities/odm-entities/odm-notification-address.entity"
import { OdmNotificationAlertEntity } from "../../entities/odm-entities/odm-notification-alert.entity"

export class GetManyNotificationByUserInfraService implements IApplicationService<ApplicationServiceEntryDto, OdmNotificationAlertEntity[]> {
    private readonly notiAlertRepository: OdmNotificationAlertRepository

    constructor(
        notiAlertRepository: OdmNotificationAlertRepository,
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