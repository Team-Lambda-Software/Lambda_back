import { Result } from "../../../Domain/result-handler/Result"
import { AuditingDto } from "../dto/auditing.dto"




export interface IAuditingRepository
{
    saveAuditing(auditing: AuditingDto): Promise<Result<AuditingDto>>
}