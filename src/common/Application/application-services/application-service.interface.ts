import { Result } from "../../Domain/result-handler/Result"
import { ApplicationServiceEntryDto } from "./dto/application-service-entry.dto"


export interface IApplicationService<D extends ApplicationServiceEntryDto, R>
{

    execute ( data: D ): Promise<Result<R>>

    get name (): string

}