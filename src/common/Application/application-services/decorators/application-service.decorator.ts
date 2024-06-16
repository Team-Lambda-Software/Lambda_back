import { Result } from "../../../Domain/result-handler/Result"
import { IApplicationService } from "../application-service.interface"
import { ApplicationServiceEntryDto } from "../dto/application-service-entry.dto"



export abstract class ApplicationServiceDecorator<D extends ApplicationServiceEntryDto, R> implements IApplicationService<D, R>
{

    protected applicationService: IApplicationService<D, R>

    constructor ( applicationService: IApplicationService<D, R> )
    {
        this.applicationService = applicationService
    }

    get name (): string
    {
        return this.applicationService.name
    }

    execute ( data: D ): Promise<Result<R>>
    {
        return this.applicationService.execute( data )
    }

}