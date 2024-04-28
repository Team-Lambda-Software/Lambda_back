import { LoggerDto } from './dto/logs.dto';



export interface ILogger {

    SuccessLog ( logData: LoggerDto): void
    FailLog ( logData: LoggerDto): void

}