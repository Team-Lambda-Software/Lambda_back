import { Body, Controller, Inject, Logger, Param, ParseUUIDPipe, Patch, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { OrmProgressCourseRepository } from "../repositories/orm-repositories/orm-progress-course-repository";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { User } from "src/user/domain/user";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { DataSource } from "typeorm";
import { OrmProgressCourseMapper } from "../mappers/orm-mappers/orm-progress-course-mapper";
import { OrmProgressSectionMapper } from "../mappers/orm-mappers/orm-progress-section-mapper";
import { OrmProgressVideoMapper } from "../mappers/orm-mappers/orm-progress-video-mapper";
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper";
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { SaveVideoProgressSwaggerResponseDto } from "../dto/response/save-video-progress-swagger-response.dto";
import { SaveVideoProgressServiceEntryDto } from "src/progress/application/dto/parameters/save-progress-video-entry.dto";
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { SaveVideoProgressApplicationService } from "src/progress/application/services/commands/save-progress-video.application.service";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { SaveVideoProgressEntryDto } from "../dto/entry/save-video-progress-entry.dto";
import { SaveSectionProgressSwaggerResponseDto } from "../dto/response/save-section-progress-swagger-response.dto";
import { SaveSectionProgressEntryDto } from "../dto/entry/save-section-progress-entry.dto";
import { SaveSectionProgressServiceEntryDto } from "src/progress/application/dto/parameters/save-progress-section-entry.dto";
import { SaveSectionProgressApplicationService } from "src/progress/application/services/commands/save-progress-section.application.service";
import { SaveCourseProgressSwaggerResponseDto } from "../dto/response/save-course-progress-swagger-response.dto";
import { SaveCourseProgressEntryDto } from "../dto/entry/save-course-progress-entry.dto";
import { SaveCourseProgressServiceEntryDto } from "src/progress/application/dto/parameters/save-progress-course-entry.dto";
import { SaveCourseProgressApplicationService } from "src/progress/application/services/commands/save-progress-course.application.service";
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"

@ApiTags('Progress')
@Controller('Progress')
export class ProgressController {

    private readonly progressRepository:OrmProgressCourseRepository;

    private readonly logger:Logger = new Logger( "ProgressController" );

    constructor ( @Inject( 'DataSource' ) private readonly dataSource:DataSource )
    {
        this.progressRepository = new OrmProgressCourseRepository(
            new OrmProgressCourseMapper(),
            new OrmProgressSectionMapper(),
            new OrmProgressVideoMapper(),
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper(),
                    new OrmTrainerMapper()
                ),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            ),
            dataSource
        );
    }

    @Patch( '/ProgressVideo/:videoId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Guarda el progreso del video dado. Retorna el objeto que refleja el progreso guardado', type: SaveVideoProgressSwaggerResponseDto })
    async saveVideoProgress( @Body() saveDTO: SaveVideoProgressEntryDto, @GetUser()user:User)
    {
        const saveVideoProgressDto:SaveVideoProgressServiceEntryDto = {userId:user.Id, ...saveDTO};
        
        const saveVideoProgressService = new ExceptionDecorator(
            new LoggingDecorator(
                new SaveVideoProgressApplicationService(this.progressRepository),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )

        const updateResult = await saveVideoProgressService.execute(saveVideoProgressDto);
        return updateResult.Value; //? Should this consider the possibility of having to return some error?
    }

    @Patch( '/ProgressSection/:sectionId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Guarda el progreso de la seccion dada. En caso de incluir modificaciones en los videos, guarda su progreso en cascada. Retorna el objeto que refleja el progreso guardado', type: SaveSectionProgressSwaggerResponseDto })
    async saveSectionProgress( @Body() saveDTO: SaveSectionProgressEntryDto, @GetUser()user:User)
    {
        //Use other application service to also save videos in cascade?
        //! How to avoid service coupling to one another?
        const saveVideoProgressService = new SaveVideoProgressApplicationService(this.progressRepository);

        const saveSectionProgressDto:SaveSectionProgressServiceEntryDto = {userId:user.Id, ...saveDTO};

        const saveSectionProgressService = new ExceptionDecorator(
            new LoggingDecorator(
                new SaveSectionProgressApplicationService(this.progressRepository, saveVideoProgressService),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )

        const updateResult = await saveSectionProgressService.execute(saveSectionProgressDto);
        return updateResult.Value; //? Should this consider the possibility of having to return some error?
    }

    @Patch( '/ProgressCourse/:courseId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    //? How to create typed objects again? How to use ValidationPipe? @UsePipes(new ValidationPipe({transform: true}))
    @ApiOkResponse({ description: 'Guarda el progreso del curso dado. En caso de incluir modificaciones en las secciones, guarda su progreso en cascada. Retorna el objeto que refleja el progreso guardado', type: SaveCourseProgressSwaggerResponseDto })
    async saveCourseProgress( @Body() saveDTO: SaveCourseProgressEntryDto, @GetUser()user:User)
    {
        //Use other application service to also save videos in cascade?
        //! How to avoid service coupling to one another?
        const saveSectionProgressService = new SaveSectionProgressApplicationService(this.progressRepository, new SaveVideoProgressApplicationService(this.progressRepository));

        const saveCourseProgressDto:SaveCourseProgressServiceEntryDto = {userId:user.Id, ...saveDTO};

        const saveCourseProgressService = new ExceptionDecorator(
            new LoggingDecorator(
                new SaveCourseProgressApplicationService(this.progressRepository, saveSectionProgressService),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )

        const updateResult = await saveCourseProgressService.execute(saveCourseProgressDto);
        return updateResult.Value; //? Should this consider the possibility of having to return some error?
    }
}