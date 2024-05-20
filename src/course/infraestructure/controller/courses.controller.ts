import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { GetCourseApplicationService } from "src/course/application/services/queries/get-course.service"
import { DataSource } from "typeorm"
import { OrmCourseRepository } from "../repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "../mappers/orm-mappers/orm-course-mapper"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { OrmSectionMapper } from "../mappers/orm-mappers/orm-section-mapper"
import { OrmSectionCommentMapper } from "../mappers/orm-mappers/orm-section-comment-mapper"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { GetCourseSwaggerResponseDto } from "../dto/responses/get-course-swagger-response.dto"
import { SearchCoursesSwaggerResponseDto } from "../dto/responses/search-courses-swagger-response.dto"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { OrmProgressCourseRepository } from '../../../progress/infraestructure/repositories/orm-repositories/orm-progress-course-repository'
import { OrmProgressCourseMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-course-mapper"
import { OrmProgressSectionMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-section-mapper"
import { OrmProgressVideoMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-video-mapper"
import { SearchCourseQueryParametersDto } from "../dto/queryParameters/search-course-query-parameters.dto"
import { SearchCoursesByCategoryServiceEntryDto } from "src/course/application/dto/param/search-courses-by-category-service-entry.dto"
import { SearchMostPopularCoursesByCategoryApplicationService } from "src/course/application/services/queries/search-most-popular-courses-by-category.service"
import { SearchRecentCoursesByCategoryApplicationService } from "src/course/application/services/queries/search-recent-courses-by-category.service"
import { OrmCategoryRepository } from "src/categories/infraesctructure/repositories/orm-repositories/orm-category-repository"
import { OrmTrainerRepository } from "src/trainer/infraestructure/repositories/orm-repositories/orm-trainer-repository"
import { OrmCategoryMapper } from "src/categories/infraesctructure/mappers/orm-mappers/orm-category-mapper"
import { SearchCoursesByTrainerServiceEntryDto } from "src/course/application/dto/param/search-courses-by-trainer-service-entry.dto"
import { SearchMostPopularCoursesByTrainerApplicationService } from "src/course/application/services/queries/search-most-popular-courses-by-trainer.service"
import { SearchRecentCoursesByTrainerApplicationService } from "src/course/application/services/queries/search-recent-courses-by-trainer.service"


@ApiTags( 'Course' )
@Controller( 'course' )
export class CourseController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly progressRepository: OrmProgressCourseRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly categoryRepository: OrmCategoryRepository
    private readonly trainerRepository: OrmTrainerRepository
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
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
                dataSource )
        this.auditingRepository = new OrmAuditingRepository( dataSource )

        this.categoryRepository = new OrmCategoryRepository(
            new OrmCategoryMapper(),
            dataSource )

        this.trainerRepository = new OrmTrainerRepository(
            new OrmTrainerMapper(),
            dataSource
        )

    }

    @Get( 'one/:id' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de un curso dado el id', type: GetCourseSwaggerResponseDto } )
    async getCourse ( @Param( 'id', ParseUUIDPipe ) id: string, @GetUser() user: User )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseApplicationService(
                        this.courseRepository,
                        this.progressRepository,
                        this.categoryRepository,
                        this.trainerRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( { courseId: id, userId: user.Id } )
        return result.Value
    }

    @Get( 'many' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de los cursos', type: SearchCoursesSwaggerResponseDto, isArray: true } )
    async searchCourses ( @GetUser() user: User, @Query() searchCourseParams: SearchCourseQueryParametersDto )
    {

        if ( ( searchCourseParams.category || ( !searchCourseParams.category && !searchCourseParams.trainer ) ) )
        {
            const searchCourseServiceEntry: SearchCoursesByCategoryServiceEntryDto = { categoryId: searchCourseParams.category, userId: user.Id, pagination: { page: searchCourseParams.page, perPage: searchCourseParams.perPage } }

            if ( searchCourseParams.filter == 'POPULAR' )
            {
                const service =
                    new ExceptionDecorator(
                        new LoggingDecorator(
                            new SearchMostPopularCoursesByCategoryApplicationService(
                                this.courseRepository,
                                this.progressRepository,
                                this.categoryRepository,
                                this.trainerRepository
                            ),
                            new NativeLogger( this.logger )
                        )
                    )
                const result = await service.execute( searchCourseServiceEntry )

                return result.Value
            } else
            {
                const service =
                    new ExceptionDecorator(
                        new LoggingDecorator(
                            new SearchRecentCoursesByCategoryApplicationService(
                                this.courseRepository,
                                this.categoryRepository,
                                this.trainerRepository
                            ),
                            new NativeLogger( this.logger )
                        )
                    )
                const result = await service.execute( searchCourseServiceEntry )

                return result.Value
            }

        }

        const searchCourseServiceEntry: SearchCoursesByTrainerServiceEntryDto = { trainerId: searchCourseParams.trainer, userId: user.Id, pagination: { page: searchCourseParams.page, perPage: searchCourseParams.perPage } }

        if ( searchCourseParams.filter == 'POPULAR' )
        {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchMostPopularCoursesByTrainerApplicationService(
                            this.courseRepository,
                            this.progressRepository,
                            this.categoryRepository,
                            this.trainerRepository
                        ),
                        new NativeLogger( this.logger )
                    )
                )
            const result = await service.execute( searchCourseServiceEntry )

            return result.Value
        } else
        {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchRecentCoursesByTrainerApplicationService(
                            this.courseRepository,
                            this.categoryRepository,
                            this.trainerRepository
                        ),
                        new NativeLogger( this.logger )
                    )
                )
            const result = await service.execute( searchCourseServiceEntry )

            return result.Value
        }


    }

    // @Post( 'levels/search' )
    // @UseGuards( JwtAuthGuard )
    // @ApiBearerAuth()
    // @ApiOkResponse( { description: 'Devuelve la informacion de los cursos que tengan alguno de los niveles dados', type: SearchCoursesSwaggerResponseDto, isArray: true } )
    // async searchCourseBylevels ( @Body() searchCourseByLevelsEntryDto: SearchCourseByLevelsEntryDto, @GetUser() user: User, @Query() pagination: PaginationDto )
    // {
    //     const searchCourseByLevelsServiceEntry: SearchCourseByLevelsServiceEntryDto = { ...searchCourseByLevelsEntryDto, userId: user.Id, pagination: pagination }
    //     const service =
    //         new ExceptionDecorator(
    //             new LoggingDecorator(
    //                 new SearchCourseByLevelsApplicationService(
    //                     this.courseRepository
    //                 ),
    //                 new NativeLogger( this.logger )
    //             )
    //         )
    //     const result = await service.execute( searchCourseByLevelsServiceEntry )

    //     return result.Value
    // }

}