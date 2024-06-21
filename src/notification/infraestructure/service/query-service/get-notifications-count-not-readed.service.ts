import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { INotificationAlertRepository } from "src/notification/application/repositories/notification-alert-repository.interface"
import { GetCountNotReadedDtoResponse } from "./dto/response/get-count-not-readed-response"

export class GetNumberNotificationNotSeenByUserInfraService implements IApplicationService<ApplicationServiceEntryDto, GetCountNotReadedDtoResponse> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }
    async execute(data: ApplicationServiceEntryDto): Promise<Result<GetCountNotReadedDtoResponse>> {
        const findNotifyResult= await this.notiAlertRepository.findAllByIdUserNotReaded(data.userId)
        if (!findNotifyResult.isSuccess()) return Result.fail( new Error('Something went wrong'), 500, 'Something went wrong' );
        let Answer = { count: findNotifyResult.Value.length }
        return(Result.success(Answer,200) )
    }
    get name(): string { return this.constructor.name }
    
}