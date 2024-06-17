import { Result } from "src/common/Domain/result-handler/Result"
import { ApplicationServiceDecorator } from "../../application-service.decorator"
import { ApplicationServiceEntryDto } from "../../../dto/application-service-entry.dto"
import { IApplicationService } from "../../../application-service.interface"
import { IExceptionHandler } from "src/common/Application/exception-handler/exception-handler.interface"



export class ExceptionDecorator<D extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<D, R> implements IApplicationService<D, R>
{

    private readonly exceptionHandler: IExceptionHandler

    constructor ( applicationService: ApplicationServiceDecorator<D, R>, exceptionHandler: IExceptionHandler)
    {
        super( applicationService )
        this.exceptionHandler = exceptionHandler
    }

    async execute ( data: D ): Promise<Result<R>>
    {
        const result = await this.applicationService.execute( data )
        if ( result.isSuccess() )
            return result
        this.exceptionHandler.HandleException( result.StatusCode, result.Message, result.Error )
    }

}