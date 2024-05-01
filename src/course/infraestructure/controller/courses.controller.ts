import { Controller, Get, Inject, Logger, Param } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { GetCourseApplicationService } from "src/course/application/services/queries/get-course.service"
import { DataSource } from "typeorm"
import { OrmCourseRepository } from "../repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "../mappers/orm-mappers/orm-course-mapper"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { OrmSectionMapper } from "../mappers/orm-mappers/orm-section-mapper"



@Controller( 'course' )
export class CourseController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {

        this.courseRepository = new OrmCourseRepository(new OrmCourseMapper(new OrmSectionMapper()), dataSource)

    }

    @Get( ':id' )
    async getCourse ( @Param( 'id' ) id: string )
    {
        const service = new ExceptionDecorator(new LoggingDecorator(new GetCourseApplicationService(this.courseRepository), new NativeLogger(this.logger))) 
        return (await service.execute({courseId: id, userId: '1'})).Value
    }

    @Get( 'search/:name')
    async searchCourse ( @Param( 'name' ) name: string )
    {
        //TODO: Implementar el servicio de busqueda
        return this.courseRepository.searchCoursesByName(name)
    }

}