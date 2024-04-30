import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { SignUpEntryApplicationDto } from "../dto/entry/sign-up-entry.application.dto";
import { SignUpResponseApplicationDto } from "../dto/response/sign-up-response.application.dto";

export class SignUpApplicationService 
    implements IApplicationService<SignUpEntryApplicationDto, SignUpResponseApplicationDto> {
    
    execute(data: any): Promise<Result<SignUpResponseApplicationDto>> {
        throw new Error("Method not implemented.");
    }
    
    get name(): string {
        throw new Error("Method not implemented.");
    }

}