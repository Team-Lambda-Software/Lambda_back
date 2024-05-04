import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { GetCourseApplicationService } from "src/course/application/services/queries/get-course.service"
import { DataSource } from "typeorm"
import { OrmCourseRepository } from "../repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "../mappers/orm-mappers/orm-course-mapper"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { OrmSectionMapper } from "../mappers/orm-mappers/orm-section-mapper"
import { SearchCourseApplicationService } from "src/course/application/services/queries/search-course.service"
import { SearchCourseEntryDto } from "../dto/entry/search-course-entry.dto"
import { SearchCourseServiceEntryDto } from "src/course/application/dto/param/search-course-service-entry.dto"
import { SearchCourseByCategoryServiceEntryDto } from "src/course/application/dto/param/search-course-by-category-service-entry.dto"
import { SearchCourseByCategoryApplicationService } from "src/course/application/services/queries/search-course-by-category.service"
import { OrmSectionCommentMapper } from "../mappers/orm-mappers/orm-section-comment-mapper"
import { GetCourseSectionApplicationService } from "src/course/application/services/queries/get-course-section.service"
import { GetCourseSectionServiceEntryDto } from "src/course/application/dto/param/get-course-section-service-entry.dto"
import { AddCommentToSectionEntryDto } from "../dto/entry/add-comment-to-section-entry.dto"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { AddCommentToSectionApplicationService } from "src/course/application/services/commands/add-comment-to-section-application.service"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { GetCourseSwaggerResponseDto } from "../dto/responses/get-course-swagger-response.dto"
import { SearchCoursesSwaggerResponseDto } from "../dto/responses/search-courses-swagger-response.dto"
import { GetSectionSwaggerResponseDto } from "../dto/responses/get-section-swagger-response.dto"
import { AddCommentToSectionSwaggerResponseDto } from "../dto/responses/add-comment-to-section-swagger-response.dto"
import { AuditingDecorator } from "src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"


@ApiTags('Course')
@Controller( 'course' )
export class CourseController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.idGenerator = new UuidGenerator()
        this.courseRepository =
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper()
                ),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            )
        this.auditingRepository = new OrmAuditingRepository(dataSource)

    }

    @Get( ':id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de un curso dado el id', type: GetCourseSwaggerResponseDto })
    async getCourse ( @Param( 'id', ParseUUIDPipe ) id: string, @GetUser()user: User)
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( { courseId: id, userId: user.Id } )
        return result.Value
    }

    @Post( 'search' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos que tengan el nombre dado', type: SearchCoursesSwaggerResponseDto, isArray: true})
    async searchCourse ( @Body() searchCourseEntryDto: SearchCourseEntryDto, @GetUser()user: User)
    {
        const searchCourseServiceEntry: SearchCourseServiceEntryDto = { ...searchCourseEntryDto, userId: user.Id}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchCourseApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchCourseServiceEntry )

        return result.Value
    }

    @Get( 'category/:categoryId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos que pertenezcan a la misma categoria', type: SearchCoursesSwaggerResponseDto, isArray: true})
    async searchCourseByCategory ( @Param('categoryId', ParseUUIDPipe) categoryId: string, @GetUser()user: User)
    {
        const searchCourseByCategoryServiceEntry: SearchCourseByCategoryServiceEntryDto = { categoryId, userId: user.Id}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchCourseByCategoryApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchCourseByCategoryServiceEntry )

        return result.Value
    }

    @Get( 'section/:sectionId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de una seccion dado el id', type: GetSectionSwaggerResponseDto })
    async getSection ( @Param( 'sectionId', ParseUUIDPipe ) sectionId: string, @GetUser()user: User)
    {
        const data: GetCourseSectionServiceEntryDto = { sectionId, userId: user.Id}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseSectionApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        
        const result = await service.execute( data )

        return result.Value
    }

    @Post( 'section/:sectionId/comment' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Agrega un comentario a una seccion', type: AddCommentToSectionSwaggerResponseDto })
    async addCommentToSection ( @Param( 'sectionId', ParseUUIDPipe ) sectionId: string, @Body() comment: AddCommentToSectionEntryDto, @GetUser()user: User)
    {
        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new LoggingDecorator(
                        new AddCommentToSectionApplicationService(
                            this.courseRepository,
                            this.idGenerator
                        ),
                        new NativeLogger( this.logger )
                    ),
                    this.auditingRepository,
                    this.idGenerator
                )
            )

        const data = { ...comment, sectionId, userId: user.Id }
        const result = await service.execute( data )
        return result.Value
    }


}