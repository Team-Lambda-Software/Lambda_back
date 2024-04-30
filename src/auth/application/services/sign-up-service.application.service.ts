import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { SignUpEntryApplicationDto } from "../dto/sign-up-entry.application.dto";

export class SignUpApplicationService 
    implements IApplicationService<SignUpEntryApplicationDto, any> {
    
    execute(data: any): Promise<Result<any>> {
        throw new Error("Method not implemented.");
    }
    
    get name(): string {
        throw new Error("Method not implemented.");
    }

}