import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { LogInEntryApplicationDto } from "../dto/entry/log-in-entry.application.dto";
import { LogInResponseApplicationDto } from "../dto/response/log-in-response.application.dto";

export class LogInApplicationService 
    implements IApplicationService<LogInEntryApplicationDto, LogInResponseApplicationDto> { 
    
    execute(data: any): Promise<Result<LogInResponseApplicationDto>> {
        throw new Error("Method not implemented.");
    }
    
    get name(): string {
        throw new Error("Method not implemented.");
    }

}