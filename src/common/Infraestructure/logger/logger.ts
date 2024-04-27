import { Logger } from "@nestjs/common"
import { LoggerDto } from "src/common/Application/logger/dto/logs.dto"
import { ILogger } from "src/common/Application/logger/logger.interface"




export class NativeLogger implements ILogger
{
    private readonly logger: Logger
    constructor (logger: Logger)
    {
        this.logger = logger
    }
    SuccessLog ( logData: LoggerDto ): void
    {
        this.logger.log( `Execution of: ${logData.name} successful, made by user ${logData.userId} with data ${logData.data}` )
    }

    FailLog ( logData: LoggerDto ): void
    {
        this.logger.error( `Execution of: ${logData.name} failed, made by user ${logData.userId} with data ${logData.data}` )
    }

}