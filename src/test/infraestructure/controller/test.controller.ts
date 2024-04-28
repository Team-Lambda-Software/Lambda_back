import { Body, Controller, Get, Logger } from "@nestjs/common"
import { IApplicationService } from '../../../common/Application/application-services/application-service.interface';
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { TestService } from "src/test/application/services/test.service"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"



@Controller( 'test' )
export class TestController {

    private readonly logger: Logger = new Logger( "TestController" )
    @Get('testLogs')
    async testLogs ( @Body() data: {name:string, price:number, userId: string} )
    {
        //the object in the body and in the generic should be a dto
        const testService: IApplicationService<{name:string, price:number, userId: string}, string> = new ExceptionDecorator(new LoggingDecorator(new TestService(), new NativeLogger(this.logger)))
        const result = await testService.execute(data)
        return result.Value
    }

}