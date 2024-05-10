import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common"
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
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { SearchCourseByLevelsEntryDto } from "../dto/entry/search-course-by-levels-entry.dto"
import { SearchCourseByLevelsServiceEntryDto } from "src/course/application/dto/param/search-course-by-levels-service-entry.dto"
import { SearchCourseByLevelsApplicationService } from "src/course/application/services/queries/search-course-by-levels.service"
import { SearchCourseByTagsEntryDto } from "../dto/entry/search-course-by-tags-entry.dto"
import { SearchCourseByTagsServiceEntryDto } from "src/course/application/dto/param/search-course-by-tags-service-entry.dto"
import { SearchCourseByTagsApplicationService } from "src/course/application/services/queries/search-courses-by-tags.service"
import { OrmProgressCourseRepository } from '../../../progress/infraestructure/repositories/orm-repositories/orm-progress-course-repository';
import { OrmProgressCourseMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-course-mapper"
import { OrmProgressSectionMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-section-mapper"
import { OrmProgressVideoMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-video-mapper"
import { GetMostPopularCoursesServiceEntryDto } from "src/course/application/dto/param/get-most-popular-courses-service-entry.dto"
import { GetMostPopularCoursesApplicationService } from "src/course/application/services/queries/get-most-popular-courses.service"


@ApiTags('Course')
@Controller( 'course' )
export class CourseController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly progressRepository: OrmProgressCourseRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.idGenerator = new UuidGenerator()
        this.courseRepository =
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper(),
                    new OrmTrainerMapper()
                ),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            )
        this.progressRepository = 
        new OrmProgressCourseRepository(
            new OrmProgressCourseMapper(),
            new OrmProgressSectionMapper(),
            new OrmProgressVideoMapper(),
            this.courseRepository, 
            dataSource)        
        this.auditingRepository = new OrmAuditingRepository(dataSource)

    }

    @Get( ':id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de un curso dado el id', type: GetCourseSwaggerResponseDto })
    async getCourse ( @Param( 'id', ParseUUIDPipe ) id: string, @GetUser()user: User, @Query() sectionPagination: PaginationDto )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseApplicationService(
                        this.courseRepository,
                        this.progressRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( { courseId: id, userId: user.Id, sectionPagination: sectionPagination } )
        return result.Value
    }

    @Post( 'search' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos que tengan el nombre dado', type: SearchCoursesSwaggerResponseDto, isArray: true})
    async searchCourse ( @Body() searchCourseEntryDto: SearchCourseEntryDto, @GetUser()user: User, @Query() pagination: PaginationDto )
    {
        const searchCourseServiceEntry: SearchCourseServiceEntryDto = { ...searchCourseEntryDto, userId: user.Id, pagination: pagination}
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

    @Get( 'search/PopularCourses' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos mas populares', type: SearchCoursesSwaggerResponseDto, isArray: true})
    async searchPopularCourse ( @GetUser()user: User, @Query() pagination: PaginationDto )
    {
        const searchPopularCourseServiceEntry: GetMostPopularCoursesServiceEntryDto = { userId: user.Id, pagination: pagination}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetMostPopularCoursesApplicationService(
                        this.courseRepository,
                        this.progressRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchPopularCourseServiceEntry )

        return result.Value
    }

    @Post( 'levels/search' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos que tengan alguno de los niveles dados', type: SearchCoursesSwaggerResponseDto, isArray: true})
    async searchCourseBylevels ( @Body() searchCourseByLevelsEntryDto: SearchCourseByLevelsEntryDto, @GetUser()user: User, @Query() pagination: PaginationDto )
    {
        const searchCourseByLevelsServiceEntry: SearchCourseByLevelsServiceEntryDto = { ...searchCourseByLevelsEntryDto, userId: user.Id, pagination: pagination}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchCourseByLevelsApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchCourseByLevelsServiceEntry )

        return result.Value
    }

    @Post( 'tags/search' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos que tengan alguno de los tags dados', type: SearchCoursesSwaggerResponseDto, isArray: true})
    async searchCourseByTags ( @Body() searchCourseByTagsEntryDto: SearchCourseByTagsEntryDto, @GetUser()user: User, @Query() pagination: PaginationDto )
    {
        const searchCourseByTagsServiceEntry: SearchCourseByTagsServiceEntryDto = { ...searchCourseByTagsEntryDto, userId: user.Id, pagination: pagination}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchCourseByTagsApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchCourseByTagsServiceEntry )
        return result
    }

    @Get( 'category/:categoryId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos que pertenezcan a la misma categoria', type: SearchCoursesSwaggerResponseDto, isArray: true})
    async searchCourseByCategory ( @Param('categoryId', ParseUUIDPipe) categoryId: string, @GetUser()user: User, @Query() pagination: PaginationDto )
    {
        const searchCourseByCategoryServiceEntry: SearchCourseByCategoryServiceEntryDto = { categoryId, userId: user.Id, pagination: pagination}
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
    async getSection ( @Param( 'sectionId', ParseUUIDPipe ) sectionId: string, @GetUser()user: User, @Query() commentPagination: PaginationDto )
    {
        const data: GetCourseSectionServiceEntryDto = { sectionId, userId: user.Id, commentPagination: commentPagination}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseSectionApplicationService(
                        this.courseRepository,
                        this.progressRepository
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