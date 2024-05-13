


export interface AuditingDto
{
    id: string
    userId: string
    operation: string
    data: string
    madeAt: Date
    wasSuccessful: boolean
}