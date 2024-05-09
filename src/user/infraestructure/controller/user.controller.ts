/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { OrmUserRepository } from "../repositories/orm-repositories/orm-user-repository"
import { DataSource, /*EntityManager, In */} from "typeorm"
import { OrmUserMapper } from '../mappers/orm-mapper/orm-user-mapper';
import { /*IdGenerator*/ } from "src/common/Application/Id-generator/id-generator.interface"
import { /*UuidGenerator*/ } from "src/common/Infraestructure/id-generator/uuid-generator"
import { GetUserProfileApplicationService } from "src/user/application/services/get-user-profile.application.service"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { userUpdateEntryDtoService } from "src/user/dto/user-update-entry-Service";
import { UpdateUserProfileAplicationService } from "src/user/application/services/update-user-profile.application.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/user/domain/user";
import { OrmTrainerRepository } from "src/trainer/infraestructure/repositories/orm-repositories/orm-trainer-repository";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
import { FollowTrainerUserApplicationService } from "src/user/application/services/follow-trainer-user.application.service";
import { UnfollowTrainerUserApplicationService } from "src/user/application/services/unfollow-trainer-user.application.service";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";


@ApiTags('User')
@Controller('user')
export class UserController {

    private readonly userRepository: OrmUserRepository
    private readonly trainerRepository: OrmTrainerRepository
    private readonly logger: Logger = new Logger( "UserController" )
    
    constructor(@Inject('DataSource') private readonly dataSource: DataSource) {
        
        this.userRepository = new OrmUserRepository(new OrmUserMapper(), dataSource)
        this. trainerRepository = new OrmTrainerRepository(new OrmTrainerMapper(), dataSource)

    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ 
        description: 'Devuelve informacion sobre un usuario, toda su información de registro y los entrenadores a los que sigue; dado su id.', 
        type: User
    })
    async getUser(@Param('id') id: string) {
        
        const getUserProfileService = new ExceptionDecorator(
            new LoggingDecorator(
                new GetUserProfileApplicationService(this.userRepository), 
                new NativeLogger(this.logger)
            )
        )
        return (await getUserProfileService.execute({userId: id})).Value
        
    }

    
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateUser(@Param('id') id: string, @Body() userDTO: userUpdateEntryDtoService){

        const userUpdateDto = {userId: id,...userDTO};
        
        const updateUserProfileService = new ExceptionDecorator(
            new LoggingDecorator(
                new UpdateUserProfileAplicationService(this.userRepository), 
                new NativeLogger(this.logger)
            )
        )

        const resultUpdate = (await updateUserProfileService.execute(userUpdateDto))

        return resultUpdate

    }

    @Post('/follow/:trainerID')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ 
        description: ' Agrega una nueva relacion entre un entrenado y un usuario, devuelve el id del entrenador; dado el id del entranador y del usuario.', 
        //type: User
    })
    async followTrainer(@Param('trainerID') id: string, @GetUser()user: User)
    {

        const userTrainerFollowDTO = {userId: user.Id,trainerId: id}

        const followService = new ExceptionDecorator(
            new LoggingDecorator(
                new FollowTrainerUserApplicationService(this.trainerRepository),
                new NativeLogger(this.logger)
            )
        )

        const resultado = await followService.execute(userTrainerFollowDTO)

        if(!resultado.isSuccess){
            return resultado.Error
        }

        return resultado.Value

    }

    @Delete('unfollow/:trainerID')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({})
    async unfollowTrainer(@Param('trainerID') id: string, @GetUser()user: User)
    {
        const userTrainerUnfollowDTO = {userId: user.Id, trainerId: id}

        const unfollowService = new ExceptionDecorator(
            new LoggingDecorator(
                new UnfollowTrainerUserApplicationService(this.trainerRepository),
                new NativeLogger(this.logger)
            )
        )

        const resultado = await unfollowService.execute(userTrainerUnfollowDTO)

        if(!resultado.isSuccess){
            return resultado.Error
        }

        return resultado.Value
    }

}