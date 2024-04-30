import { Result } from "src/common/Application/result-handler/Result";
import { ApplicationServiceEntryDto } from "../../../dto/application-service-entry.dto";
import { ApplicationServiceDecorator } from "../../application-service.decorator";
import { User } from "src/user/domain/user";
import { IApplicationService } from "../../../application-service.interface";

export class SecurityDecorator<D extends ApplicationServiceEntryDto, R> 
    extends ApplicationServiceDecorator<D, R> {
        
        constructor(
            applicationService: IApplicationService<D, R>,
        ){
            super(applicationService);
        }

        execute ( data: D ): Promise<Result<R>> {
            return this.applicationService.execute( data )
        }
    
        async checkAuthorization(user: User) {}

        get name (): string { return this.applicationService.name }
}