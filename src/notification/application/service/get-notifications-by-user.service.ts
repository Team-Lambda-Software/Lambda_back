import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Application/result-handler/Result"
import { INotificationAlertRepository } from "src/notification/domain/repositories/notification-alert-repository.interface"
import { GetNotificationsUserDtoEntryAplicationDto } from "../dto/get-notifications-by-user.aplication.dto"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"

export class GetManyNotificationByUserApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly userRespository: IUserRepository
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }

    async execute(data: GetNotificationsUserDtoEntryAplicationDto): Promise<Result<any>> {
        let {userId,...dataPagination}=data;
        
        const notificationResult= await this.notiAlertRepository.findManyNotificationsByIdUser(userId,dataPagination)
        
        if (!notificationResult.isSuccess())
            return Result.fail( new Error('Sin notificaciones asociadas'), 500, 'Sin notificaciones asociadas' );
        return (notificationResult)
        
    }
    get name(): string { return this.constructor.name }
}