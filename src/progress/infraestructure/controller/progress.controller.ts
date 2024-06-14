import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { OrmProgressCourseRepository } from "../repositories/orm-repositories/orm-progress-course-repository";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { User } from "src/user/domain/user";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { DataSource } from "typeorm";
import { OrmProgressCourseMapper } from "../mappers/orm-mappers/orm-progress-course-mapper";
import { OrmProgressSectionMapper } from "../mappers/orm-mappers/orm-progress-section-mapper";
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper";
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { SaveSectionProgressSwaggerResponseDto } from "../dto/response/save-section-progress-swagger-response.dto";
import { SaveSectionProgressApplicationService } from "src/progress/application/services/commands/save-progress-section.application.service";
import { SaveCourseProgressSwaggerResponseDto } from "../dto/response/save-course-progress-swagger-response.dto";
import { SaveCourseProgressServiceEntryDto } from "src/progress/application/dto/parameters/save-progress-course-entry.dto";
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { SaveProgressEntryDto } from "../dto/entry/save-progress-entry.dto";
import { SyncCourseProgressApplicationService } from "src/progress/application/services/commands/sync-progress-course.application.service";
import { SyncProgressCourseEntryDto } from "src/progress/application/dto/parameters/sync-progress-course-entry.dto";
import { setUncaughtExceptionCaptureCallback } from "process";
import { SaveSectionProgressServiceEntryDto } from "src/progress/application/dto/parameters/save-progress-section-entry.dto";
import { GetCourseProgressSwaggerResponseDto } from "../dto/response/get-course-progress-swagger-response.dto";
import { GetAllSectionsFromCourseEntryDto } from "src/progress/application/dto/parameters/get-all-sections-from-course-entry.dto";
import { GetAllSectionsFromCourseApplicationService } from "src/progress/application/services/queries/get-all-sections-from-course.application.service";
import { GetTrendingCourseSwaggerResponseDto } from "../dto/response/get-trending-progress-swagger-response.dto";
import { GetTrendingCourseApplicationService } from "src/progress/application/services/queries/get-trending-course.application.service";
import { GetProgressProfileSwaggerResponseDto } from "../dto/response/get-progress-profile-swagger-response.dto";
import { GetProgressProfileApplicationService } from "src/progress/application/services/queries/get-progress-profile.application.service";
import { GetAllStartedCoursesSwaggerEntryDto } from "../dto/entry/get-all-started-courses-entry.dto";
import { GetAllStartedCoursesSwaggerResponseDto } from "../dto/response/get-all-started-courses-response.dto";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";
import { GetAllStartedCoursesApplicationService } from "src/progress/application/services/queries/get-all-started-courses.application.service";
import { OrmCategoryRepository } from "src/categories/infraesctructure/repositories/orm-repositories/orm-category-repository";
import { OrmCategoryMapper } from "src/categories/infraesctructure/mappers/orm-mappers/orm-category-mapper";

@ApiTags('Progress')
@Controller('progress')
export class ProgressController {

    private readonly progressRepository:OrmProgressCourseRepository;
    private readonly courseRepository:OrmCourseRepository;
    private readonly categoryRepository:OrmCategoryRepository;

    private readonly logger:Logger = new Logger( "ProgressController" );

    constructor ( @Inject( 'DataSource' ) private readonly dataSource:DataSource )
    {
        this.courseRepository = new OrmCourseRepository(
            new OrmCourseMapper(
                new OrmSectionMapper(),
                new OrmTrainerMapper()
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
        this.categoryRepository = new OrmCategoryRepository(
            new OrmCategoryMapper(),
            dataSource
        );
    }

    //Save progress on a given section, made by an user. Then, update the progress on the whole course
    @Post( 'mark/end' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Guarda el progreso de una leccion de un curso dado'})
    async saveSectionProgress( @Body() saveDTO: SaveProgressEntryDto, @GetUser()user:User)
    {

        const saveSectionProgressDto:SaveSectionProgressServiceEntryDto = {
            courseId: saveDTO.courseId,
            sectionId: saveDTO.lessonId,
            userId: user.Id,
            isCompleted: saveDTO.markAsCompleted,
            videoSecond: saveDTO.time
        };
        const syncCourseProgressDto:SyncProgressCourseEntryDto = {
            userId: user.Id,
            courseId: saveDTO.courseId
        };

        const saveSectionProgressService = new ExceptionDecorator(
            new LoggingDecorator(
                new SaveSectionProgressApplicationService(this.progressRepository),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        );

        const syncCourseProgressService = new ExceptionDecorator(
            new LoggingDecorator(
                new SyncCourseProgressApplicationService(this.progressRepository),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        );

        //TEST
            console.log("Initiating SaveSectionProgressService");
        const sectionUpdateResult = await saveSectionProgressService.execute(saveSectionProgressDto);
        //TEST
            console.log("Service successful");
        if (sectionUpdateResult.isSuccess())
        {
            const courseSyncResult = await syncCourseProgressService.execute(syncCourseProgressDto);
        }
    }

    //Retrieves the progress of a given course, for the current user
    @Get('one/:courseId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Obtiene el progreso de un curso dado, para el usuario actual', type:GetCourseProgressSwaggerResponseDto})
    async getCourseProgress ( @Param('courseId', ParseUUIDPipe) courseId:string, @GetUser()user:User )
    {
        const getAllSectionsEntryDto:GetAllSectionsFromCourseEntryDto = {
            userId: user.Id,
            courseId: courseId
        }

        const getAllSectionsApplicationService = new ExceptionDecorator(
            new LoggingDecorator(
                new GetAllSectionsFromCourseApplicationService(this.progressRepository),
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
    async getTrendingCourse(@GetUser() user:User)
    {
        const getTrendingDto = {userId: user.Id};

        const getTrendingApplicationService = new ExceptionDecorator(
            new LoggingDecorator(
                new GetTrendingCourseApplicationService(this.progressRepository, this.courseRepository),
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

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Obtiene los datos de progreso del perfil del usuario actual: progreso del ultimo curso visto y tiempo de visualizacion total en horas', type:GetProgressProfileSwaggerResponseDto})
    //Gets data related to the progress-shown-in-profile for the current user
    async GetProgressProfile(@GetUser() user)
    {
        const getProgressProfileDto = {userId: user.Id};

        const getProgressProfileApplicationService = new ExceptionDecorator(
            new LoggingDecorator(
                new GetProgressProfileApplicationService(this.progressRepository),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        );

        const returnDataResult = await getProgressProfileApplicationService.execute(getProgressProfileDto);
        const returnData = returnDataResult.Value;

        const responseDTO:GetProgressProfileSwaggerResponseDto =
        {
            percent: returnData.latestCompletionPercent,
            time: returnData.totalViewtimeInHours
        }
        return responseDTO
    }

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
        const getStartedCoursesDto = {userId: user.Id, pagination: paginationDto};

        const getAllStartedCoursesApplicationService = new ExceptionDecorator(
            new LoggingDecorator(
                new GetAllStartedCoursesApplicationService(this.progressRepository, this.courseRepository, this.categoryRepository),
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