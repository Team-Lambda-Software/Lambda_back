import { Result } from "src/common/Domain/result-handler/Result"
import { ApplicationServiceDecorator } from "../../application-service.decorator"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { ApplicationServiceEntryDto } from "../../../dto/application-service-entry.dto"
import { IApplicationService } from "../../../application-service.interface"



export class ExceptionDecorator<D extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<D, R> implements IApplicationService<D, R>
{

    constructor ( applicationService: ApplicationServiceDecorator<D, R> )
    {
        super( applicationService )
    }

    async execute ( data: D ): Promise<Result<R>>
    {
        const result = await this.applicationService.execute( data )
        if ( result.isSuccess() )
            return result
        HttpExceptionHandler.HandleException( result.StatusCode, result.Message, result.Error )
    }

}