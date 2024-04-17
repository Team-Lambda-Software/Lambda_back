import { Result } from "../../result-handler/Result"
import { IApplicationService } from "../application-service.interface"



export abstract class ApplicationServiceDecorator<D, R> implements IApplicationService<D, R>
{

    private applicationService: IApplicationService<D, R>

    constructor ( applicationService: IApplicationService<D, R> )
    {
        this.applicationService = applicationService
    }

    execute ( data: D ): Promise<Result<R>>
    {
        return this.applicationService.execute( data )
    }

}