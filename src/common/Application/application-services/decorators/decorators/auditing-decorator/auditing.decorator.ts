import { Result } from "src/common/Domain/result-handler/Result"
import { IApplicationService } from "../../../application-service.interface"
import { ApplicationServiceDecorator } from "../../application-service.decorator"
import { ApplicationServiceEntryDto } from "../../../dto/application-service-entry.dto"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { IAuditingRepository } from "src/common/Application/auditing/repositories/auditing-repository.interface"
import { AuditingDto } from "src/common/Application/auditing/dto/auditing.dto"



export class AuditingDecorator<D extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<D, R> implements IApplicationService<D, R>
{

    private readonly idGenerator: IdGenerator<string>
    private readonly auditingRepository: IAuditingRepository

    constructor ( applicationService: IApplicationService<D, R>, auditingRepository: IAuditingRepository, idGenerator: IdGenerator<string> )
    {
        super( applicationService )
        this.idGenerator = idGenerator
        this.auditingRepository = auditingRepository

    }

    async execute ( data: D ): Promise<Result<R>>
    {
        const result = await super.execute( data )
        const toAudith: AuditingDto = {
            id: await this.idGenerator.generateId(),
            userId: data.userId,
            data: JSON.stringify( data ),
            operation: this.name,
            madeAt: new Date(),
            wasSuccessful: result.isSuccess()
        }
        await this.auditingRepository.saveAuditing( toAudith )
        return result
    }

}