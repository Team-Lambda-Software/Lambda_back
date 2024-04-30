import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { LogInEntryApplicationDto } from "../dto/log-in-entry.application.dto";

export class LogInApplicationService 
    implements IApplicationService<LogInEntryApplicationDto, any> { 
    
    execute(data: any): Promise<Result<any>> {
        throw new Error("Method not implemented.");
    }
    
    get name(): string {
        throw new Error("Method not implemented.");
    }

}