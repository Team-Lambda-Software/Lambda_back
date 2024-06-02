/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { OrmUserRepository } from "../repositories/orm-repositories/orm-user-repository"
import { DataSource} from "typeorm"
import { OrmUserMapper } from '../mappers/orm-mapper/orm-user-mapper';
import { GetUserProfileApplicationService } from "src/user/application/services/queries/get-user-profile.application.service"; 
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { userUpdateEntryInfraestructureDto } from "../dto/entry/user-update-entry-infraestructure"; 
import { UpdateUserProfileAplicationService } from "src/user/application/services/command/update-user-profile.application.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/user/domain/user";
import { OrmTrainerRepository } from "src/trainer/infraestructure/repositories/orm-repositories/orm-trainer-repository";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
import { FollowTrainerUserApplicationService } from "src/user/application/services/command/follow-trainer-user.application.service"; 
import { UnfollowTrainerUserApplicationService } from "src/user/application/services/command/unfollow-trainer-user.application.service";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { UpdateUserProfileSwaggerResponseDto } from "src/user/infraestructure/dto/response/update-user-profile-swagger-response.dto";
import { FolloUnfollowSwaggerResponseDto } from "../dto/response/follow-unfollow-entry-swagger-response.dto"; 
import { GetUserSwaggerResponseDto } from "../dto/response/get-user-swagger-response.dto";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper"
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper"
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper"
import { OrmProgressCourseRepository } from "src/progress/infraestructure/repositories/orm-repositories/orm-progress-course-repository"
import { OrmProgressCourseMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-course-mapper"
import { OrmProgressSectionMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-section-mapper"
import { OrmProgressVideoMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-video-mapper"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"


@ApiTags('User')
@Controller('user')
export class UserController {

    private readonly userRepository: OrmUserRepository
    private readonly trainerRepository: OrmTrainerRepository
    private readonly courseRepository: OrmCourseRepository
    private readonly progressRepository: OrmProgressCourseRepository
    private readonly logger: Logger = new Logger( "UserController" )
    
    constructor(@Inject('DataSource') private readonly dataSource: DataSource) {
        
        this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
        this. trainerRepository = new OrmTrainerRepository(new OrmTrainerMapper(), dataSource)
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

    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ 
        description: 'Devuelve informacion sobre un usuario, toda su información de registro y los entrenadores a los que sigue; dado su id.', 
        type: GetUserSwaggerResponseDto
    })
    async getUser(@GetUser() user: User, @Query() pagination: PaginationDto) {
        
        const getUserProfileService = new ExceptionDecorator(
            new LoggingDecorator(
                new GetUserProfileApplicationService(this.userRepository, this.progressRepository, this.courseRepository), 
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        
        const resultado = await getUserProfileService.execute({userId: user.Id, pagination})

        if(!resultado.isSuccess){
          return resultado.Error
        }
        
        return resultado.Value
        
    }

    
    @Patch('/update')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Modificar dato/s de registro de un usuario, dado el id del usuario',
        type: UpdateUserProfileSwaggerResponseDto
    })
    async updateUser(@Body() updateEntryDTO: userUpdateEntryInfraestructureDto){
        const userUpdateDto = {...updateEntryDTO};

        const updateUserProfileService = new ExceptionDecorator(
            new LoggingDecorator(
                new UpdateUserProfileAplicationService(this.userRepository), 
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )

        const resultUpdate = (await updateUserProfileService.execute(userUpdateDto))

        if(!resultUpdate.isSuccess){
          return resultUpdate.Error
        }

        const Respuesta: UpdateUserProfileSwaggerResponseDto = {
            Id: resultUpdate.Value.userId
        }

        return Respuesta

    }

    @Post('/follow/:trainerID')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ 
        description: ' Agrega una nueva relacion entre un entrenador y un usuario, devuelve el id del entrenador; dado el id del entranador y del usuario.', 
        type: FolloUnfollowSwaggerResponseDto
    })
    async followTrainer(@Param('trainerID') id: string, @GetUser()user: User)
    {

        const userTrainerFollowDTO = {userId: user.Id,trainerId: id}

        const followService = new ExceptionDecorator(
            new LoggingDecorator(
                new FollowTrainerUserApplicationService(this.trainerRepository),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )

        const resultado = await followService.execute(userTrainerFollowDTO)

        if(!resultado.isSuccess){
            return resultado.Error
        }

        return resultado.Value

    }

    @Delete('unfollow/:trainerID')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description:', dado el id del entrenador y del usuario',
        type: FolloUnfollowSwaggerResponseDto
    })
    async unfollowTrainer(@Param('trainerID') id: string, @GetUser()user: User)
    {
        const userTrainerUnfollowDTO = {userId: user.Id, trainerId: id}

        const unfollowService = new ExceptionDecorator(
            new LoggingDecorator(
                new UnfollowTrainerUserApplicationService(this.trainerRepository),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )

        const resultado = await unfollowService.execute(userTrainerUnfollowDTO)

        if(!resultado.isSuccess){
            return resultado.Error
        }

        return resultado.Value
    }

}