import { Controller, Inject, Logger } from "@nestjs/common"
import { DataSource } from "typeorm"



@Controller( 'course' )
export class CourseController
{

    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {

    }

}