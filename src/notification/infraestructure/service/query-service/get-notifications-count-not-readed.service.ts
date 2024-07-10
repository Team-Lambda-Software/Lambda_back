import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetCountNotReadedDtoResponse } from "./dto/response/get-count-not-readed-response"
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface"

export class GetNumberNotificationNotSeenByUserInfraService implements IApplicationService<ApplicationServiceEntryDto, GetCountNotReadedDtoResponse> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ){
        this.notiAlertRepository = notiAlertRepository
    }
    async execute(data: ApplicationServiceEntryDto): Promise<Result<GetCountNotReadedDtoResponse>> {
        const notiResult= await this.notiAlertRepository.findAllByIdUserNotReaded(data.userId)
        if (!notiResult.isSuccess()) return Result.fail( notiResult.Error, notiResult.StatusCode, notiResult.Message );
        let Answer = { count: notiResult.Value.length }
        return(Result.success(Answer, 200) )
    }
    get name(): string { return this.constructor.name }
    
}