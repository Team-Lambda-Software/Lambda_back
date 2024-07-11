import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { OrmProgressCourseRepository } from "../repositories/orm-repositories/orm-progress-course-repository"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { DataSource } from "typeorm"
import { OrmProgressCourseMapper } from "../mappers/orm-mappers/orm-progress-course-mapper"
import { OrmProgressSectionMapper } from "../mappers/orm-mappers/orm-progress-section-mapper"
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper"
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper"
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { SaveSectionProgressApplicationService } from "src/progress/application/services/commands/save-progress-section.application.service"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { SaveProgressEntryDto } from "../dto/entry/save-progress-entry.dto"
import { SaveSectionProgressServiceEntryDto } from "src/progress/application/dto/parameters/save-progress-section-entry.dto"
import { GetCourseProgressSwaggerResponseDto } from "../dto/response/get-course-progress-swagger-response.dto"
import { GetAllSectionsFromCourseEntryDto } from "src/progress/application/dto/parameters/get-all-sections-from-course-entry.dto"
import { GetTrendingCourseSwaggerResponseDto } from "../dto/response/get-trending-progress-swagger-response.dto"
import { GetAllStartedCoursesSwaggerEntryDto } from "../dto/entry/get-all-started-courses-entry.dto"
import { GetAllStartedCoursesSwaggerResponseDto } from "../dto/response/get-all-started-courses-response.dto"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { InitiateCourseProgressEntryDto } from "src/progress/application/dto/parameters/initiate-course-progress-entry.dto"
import { RabbitEventBus } from "src/common/Infraestructure/rabbit-event-bus/rabbit-event-bus"
import { InitiateCourseProgressApplicationService } from "src/progress/application/services/commands/initiate-course-progress.application.service"
import { UserHasProgressed } from "src/progress/domain/events/user-has-progressed-event"
import { SectionCompleted } from "src/progress/domain/events/section-completed-event"
import { CourseCompleted } from "src/progress/domain/events/course-completed-event"
import { CourseSubscriptionCreated } from "src/progress/domain/events/course-subscription-created-event"
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface"
import { ProgressQueryRepository } from "../repositories/progress-query-repository.interface"
import { Model } from "mongoose"
import { OdmProgressEntity } from "../entities/odm-entities/odm-progress.entity"
import { InitiateProgressQuerySynchronizer } from "../query-synchronizers/initiate-progress-query-synchronizer"
import { CourseCompletedQuerySynchronizer } from "../query-synchronizers/course-completed-query-synchronizer"
import { SectionCompletedQuerySynchronizer } from "../query-synchronizers/section-completed-query-synchronizer"
import { SaveProgressQuerySynchronizer } from "../query-synchronizers/save-progress-query-synchronizer"
import { InjectModel } from "@nestjs/mongoose"
import { OdmCourseRepository } from "src/course/infraestructure/repositories/odm-repositories/odm-course-repository"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { OdmProgressRepository } from "../repositories/odm-repositories/odm-progress-repository"
import { GetCourseProgressService } from "../query-services/services/get-all-sections-from-course.service"
import { GetTrendingCourseService } from "../query-services/services/get-trending-course.service"
import { GetAllStartedCoursesService } from "../query-services/services/get-all-started-courses.service"
import { PerformanceDecorator } from "src/common/Application/application-services/decorators/decorators/performance-decorator/performance.decorator"

@ApiTags('Progress')
@Controller('progress')
export class ProgressController {

    private readonly progressRepository:OrmProgressCourseRepository;
    private readonly courseRepository:OrmCourseRepository;

    private readonly odmCourseRepository:CourseQueryRepository;
    private readonly odmProgressRepository:ProgressQueryRepository;

    private readonly initiateProgressQuerySynchronizer:InitiateProgressQuerySynchronizer;
    private readonly courseCompletedQuerySynchronizer:CourseCompletedQuerySynchronizer;
    private readonly sectionCompletedQuerySynchronizer:SectionCompletedQuerySynchronizer;
    private readonly userProgressedQuerySynchronizer:SaveProgressQuerySynchronizer;

    private readonly eventBus = RabbitEventBus.getInstance();

    private readonly logger:Logger = new Logger( "ProgressController" );

    constructor ( 
        @InjectModel( 'Progress' ) private readonly progressModel:Model<OdmProgressEntity>,
        @InjectModel( 'Course' ) private readonly courseModel: Model<OdmCourseEntity>,
        @InjectModel( 'SectionComment' ) private readonly sectionCommentModel: Model<OdmSectionCommentEntity>,
        @Inject( 'DataSource' ) private readonly dataSource:DataSource )
    {
        this.courseRepository = new OrmCourseRepository(
            new OrmCourseMapper(
                new OrmSectionMapper()
            ),
            new OrmSectionMapper(),
            new OrmSectionCommentMapper(),
            dataSource
        );
        this.progressRepository = new OrmProgressCourseRepository(
            new OrmProgressCourseMapper(),
            new OrmProgressSectionMapper(),
            this.courseRepository,
            dataSource,
            new UuidGenerator()
        );


        this.odmCourseRepository = new OdmCourseRepository(
            this.courseModel,
            this.sectionCommentModel
        );
        this.odmProgressRepository = new OdmProgressRepository(
            this.progressModel
        );

        this.initiateProgressQuerySynchronizer = new InitiateProgressQuerySynchronizer(
            this.odmCourseRepository,
            this.odmProgressRepository,
            this.progressModel
        );
        this.courseCompletedQuerySynchronizer = new CourseCompletedQuerySynchronizer(
            this.odmProgressRepository
        );
        this.sectionCompletedQuerySynchronizer = new SectionCompletedQuerySynchronizer(
            this.odmProgressRepository
        );
        this.userProgressedQuerySynchronizer = new SaveProgressQuerySynchronizer(
            this.odmProgressRepository
        );
    }

    //Initiate progress on a given course ("subscribe" to it)
    @Post( 'start/:courseId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async subscribeToCourse(@Param('courseId', ParseUUIDPipe) courseId:string, @GetUser()user )
    {

        const initiateCourseDto:InitiateCourseProgressEntryDto = {
            courseId: courseId,
            userId: user.id
        }

        const service = 
        new ExceptionDecorator (
            new LoggingDecorator (
                new PerformanceDecorator(
                    new InitiateCourseProgressApplicationService(this.progressRepository, this.courseRepository, this.eventBus, new UuidGenerator()),
                    new NativeLogger( this.logger )
                ),
                new NativeLogger( this.logger )
            ),
            new HttpExceptionHandler()
        );

        const result = await service.execute(initiateCourseDto);
        this.eventBus.subscribe('CourseSubscriptionCreated', async (event: CourseSubscriptionCreated) => {
            this.initiateProgressQuerySynchronizer.execute( event );
        });
    }

    //Save progress on a given section, made by an user. Then, update the progress on the whole course
    @Post( 'mark/end' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Guarda el progreso de una leccion de un curso dado'})
    async saveSectionProgress( @Body() saveDTO: SaveProgressEntryDto, @GetUser()user)
    {

        const saveSectionProgressDto:SaveSectionProgressServiceEntryDto = {
            courseId: saveDTO.courseId,
            sectionId: saveDTO.lessonId,
            userId: user.id,
            isCompleted: saveDTO.markAsCompleted,
            videoSecond: saveDTO.time
        };

        const saveSectionProgressService = new ExceptionDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new SaveSectionProgressApplicationService(this.progressRepository, this.courseRepository, this.eventBus),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        );

        const sectionUpdateResult = await saveSectionProgressService.execute(saveSectionProgressDto);
        const sectionUpdate = sectionUpdateResult.Value;

        this.eventBus.subscribe('UserHasProgressed', async (event: UserHasProgressed) => {
            //TEST
                //console.log("Callback fn!")
            this.userProgressedQuerySynchronizer.execute( event );
        });
        if (sectionUpdate.sectionWasCompleted)
        { 
            this.eventBus.subscribe('SectionCompleted', async (event: SectionCompleted) => {
                this.sectionCompletedQuerySynchronizer.execute( event );
            });
        }
        if (sectionUpdate.courseWasCompleted)
        {
            this.eventBus.subscribe('CourseCompleted', async (event: CourseCompleted) => {
                this.courseCompletedQuerySynchronizer.execute( event );
            });
        }
    }

    //Retrieves the progress of a given course, for the current user
    @Get('one/:courseId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Obtiene el progreso de un curso dado, para el usuario actual', type:GetCourseProgressSwaggerResponseDto})
    async getCourseProgress ( @Param('courseId', ParseUUIDPipe) courseId:string, @GetUser()user )
    {
        const getAllSectionsEntryDto:GetAllSectionsFromCourseEntryDto = {
            userId: user.id,
            courseId: courseId
        }

        const getAllSectionsApplicationService = new ExceptionDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new GetCourseProgressService(this.odmProgressRepository),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        );

        const returnDataResult = await getAllSectionsApplicationService.execute(getAllSectionsEntryDto);
        const returnData = returnDataResult.Value;

        let lessons: Array<{lessonId:string, time?:number, percent:number}> = [];
        for (let section of returnData.sections)
        {
            lessons.push({lessonId: section.id, time: section.videoSecond, percent: section.completionPercent});
        }
        const responseDTO:GetCourseProgressSwaggerResponseDto = { percent: returnData.completionPercent, lessons: lessons }

        return responseDTO;
    }

    @Get('trending')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Obtiene el progreso del ultimo curso visto, para el usuario actual', type:GetTrendingCourseSwaggerResponseDto})
    //Gets "trending" (latest) course seen by the user
    async getTrendingCourse(@GetUser() user)
    {
        const getTrendingDto = {userId: user.id};

        const getTrendingApplicationService = new ExceptionDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new GetTrendingCourseService(this.odmProgressRepository),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        );

        const returnDataResult = await getTrendingApplicationService.execute(getTrendingDto);
        const returnData = returnDataResult.Value;

        const responseDTO:GetTrendingCourseSwaggerResponseDto =
        {
            percent: returnData.completionPercent,
            courseTitle: returnData.courseTitle,
            courseId: returnData.courseId,
            lastTime: returnData.lastTime
        }
        return responseDTO
    }

    //unused. This endpoint was discarded in the API v3. June 26th 2024
    // @Get('profile')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @ApiOkResponse({description: 'Obtiene los datos de progreso del perfil del usuario actual: progreso del ultimo curso visto y tiempo de visualizacion total en horas', type:GetProgressProfileSwaggerResponseDto})
    // //Gets data related to the progress-shown-in-profile for the current user
    // async GetProgressProfile(@GetUser() user)
    // {
    //     const getProgressProfileDto = {userId: user.id};

    //     const getProgressProfileApplicationService = new ExceptionDecorator(
    //         new LoggingDecorator(
    //             new GetProgressProfileApplicationService(this.progressRepository),
    //             new NativeLogger(this.logger)
    //         ),
    //         new HttpExceptionHandler()
    //     );

    //     const returnDataResult = await getProgressProfileApplicationService.execute(getProgressProfileDto);
    //     const returnData = returnDataResult.Value;

    //     const responseDTO:GetProgressProfileSwaggerResponseDto =
    //     {
    //         percent: returnData.latestCompletionPercent,
    //         time: returnData.totalViewtimeInHours
    //     }
    //     return responseDTO
    // }

    @Get('courses')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Obtiene todos los cursos que han sido empezados por el usuario actual', type: GetAllStartedCoursesSwaggerResponseDto, isArray: true})
    //Gets data related to the progress-shown-in-profile for the current user
    async GetAllStartedCourses(@Query() pagination:GetAllStartedCoursesSwaggerEntryDto, @GetUser() user)
    {
        const paginationDto = new PaginationDto();
        paginationDto.page = pagination.page;
        paginationDto.perPage = pagination.perPage;
        const getStartedCoursesDto = {userId: user.id, pagination: paginationDto};

        const getAllStartedCoursesApplicationService = new ExceptionDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new GetAllStartedCoursesService(this.odmProgressRepository),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        );

        const returnDataResult = await getAllStartedCoursesApplicationService.execute(getStartedCoursesDto);
        const returnData = returnDataResult.Value;

        let responseDTO:Array<GetAllStartedCoursesSwaggerResponseDto> = [];
        for (let course of returnData.courses)
        {
            responseDTO.push({
                id: course.id,
                title: course.title,
                image: course.image,
                date: course.date,
                category: course.category,
                trainer: course.trainerName,
                percent: course.completionPercent
            });
        }
        return responseDTO;
    }
}