import { Body, Controller, Inject, Logger, Param, ParseUUIDPipe, Patch, UseGuards } from "@nestjs/common";
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
            )
        )

        const updateResult = await saveVideoProgressService.execute(saveVideoProgressDto);
        return updateResult.Value; //? Should this consider the possibility of having to return some error?
    }
}