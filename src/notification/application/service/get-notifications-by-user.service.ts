import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { INotificationAlertRepository } from "src/notification/application/interfaces/notification-alert-repository.interface"
import { GetNotificationsUserDtoEntryAplicationDto } from "../dto/get-notifications-by-user.aplication.dto"

export class GetManyNotificationByUserApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }

    async execute(data: GetNotificationsUserDtoEntryAplicationDto): Promise<Result<any>> {
        let {userId,...dataPagination}=data;
        const notificationResult= await this.notiAlertRepository.findManyNotificationsByIdUser(userId,dataPagination)
        if (!notificationResult.isSuccess()) return Result.fail( new Error('´Something went wrong'), 500, '´Something went wrong' );
        return (notificationResult)
        
    }
    get name(): string { return this.constructor.name }
}