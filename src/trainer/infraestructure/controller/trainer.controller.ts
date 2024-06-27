import { Controller, Get, Inject, Logger, NotFoundException, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common"
import { OrmTrainerRepository } from "../repositories/orm-repositories/orm-trainer-repository"
import { OrmTrainerMapper } from "../mappers/orm-mapper/orm-trainer-mapper"
import { DataSource } from "typeorm"
import { GetTrainerProfileApplicationService } from "src/trainer/application/services/queries/get-trainer-profile.application.service"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { OrmBlogMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogCommentMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-comment-mapper"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetTrainerProfileSwaggerResponseDto } from "../dto/response/get-trainer-profile-swagger-response.dto"
import { User } from "src/user/domain/user"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
//A trainer teaches courses, and writes blogs
import { OrmBlogRepository } from "src/blog/infraestructure/repositories/orm-repositories/orm-blog-repository"
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper"
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper"
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper"
//Swagger documentation
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
//CCC-Logging, I think
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { FollowUnfollowEntryDtoService } from "src/user/application/dto/params/follow-unfollow-entry-Service"
import { Trainer } from "src/trainer/domain/trainer"
//import { GetTrainerService } from "../query-services/services/get-trainer.service"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { OdmTrainerEntity } from "../entities/odm-entities/odm-trainer.entity"
import { OdmTrainerRepository } from "../repositories/odm-repositories/odm-trainer-repository"
import { EventBus } from "src/common/Infraestructure/event-bus/event-bus"
import { GetManyTrainersSwaggerResponseDto } from "../dto/response/get-many-trainers-response.dto"
import { GetManyTrainersSwaggerEntryDto } from "../dto/entry/get-many-trainers-entry.dto"
import { GetManyTrainersServiceEntryDto } from "src/trainer/application/dto/parameters/get-many-trainers-service-entry.dto"
import { GetManyTrainersServiceResponseDto } from "src/trainer/application/dto/responses/get-many-trainers-service-response.dto"
import { GetAllFollowedTrainersApplicationService } from "src/trainer/application/services/queries/get-all-followed-trainers.application.service"
import { GetAllTrainersApplicationService } from "src/trainer/application/services/queries/get-all-trainers.application.service"
import { GetUserFollowingCountSwaggerResponseDto } from "../dto/response/get-user-following-count-response.dto"
import { GetUserFollowingCountApplicationService } from "src/trainer/application/services/queries/get-user-following-count.application.service"
import { TogggleTrainerFollowServiceEntryDto } from "src/trainer/application/dto/parameters/toggle-trainer-follow-service-entry.dto"
import { ToggleTrainerFollowServiceResponseDto } from "src/trainer/application/dto/responses/toggle-trainer-follow-service-response.dto"
import { UnfollowTrainerApplicationService } from "src/trainer/application/services/commands/unfollow-trainer.application.service"
import { FollowTrainerApplicationService } from "src/trainer/application/services/commands/follow-trainer.application.service"

@ApiTags('Trainer')
@Controller('trainer')
export class TrainerController {

    private readonly trainerRepository:OrmTrainerRepository;
    private readonly odmTrainerRepository:OdmTrainerRepository;
    //Course and Blog coupling
    private readonly courseRepository:OrmCourseRepository;
    private readonly blogRepository:OrmBlogRepository;
    //CCC Logging
    private readonly logger:Logger = new Logger( "TrainerController" );

    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource,
        @InjectModel('Trainer') private readonly trainerModel: Model<OdmTrainerEntity>       
    )
    {
        this.trainerRepository = new OrmTrainerRepository(new OrmTrainerMapper(), dataSource);
        this.odmTrainerRepository = new OdmTrainerRepository(trainerModel);

        this.courseRepository =
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper()
                ),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            );
        this.blogRepository = 
            new OrmBlogRepository(
                new OrmBlogMapper(),
                new OrmBlogCommentMapper(),
                dataSource
            );
    }
    
    @Get( 'one/:id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve informacion sobre un entrenador, todos sus seguidores, cursos y blogs que haya creado; dado su id.', type: GetTrainerProfileSwaggerResponseDto})
    async GetTrainerProfile( @Param('id', ParseUUIDPipe) id:string, @GetUser()user)
    {
        const service = 
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetTrainerProfileApplicationService(
                        this.trainerRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            );
        const result = await service.execute( {userId: user.id, trainerId:id} );
        const value = result.Value;
        //Map the fields of the DTO to the fields of the swagger response
        return {name: value.trainerName, id: value.trainerId, followers:value.followerCount, userFollow: value.doesUserFollow, location: value.trainerLocation};
    }

    @Post( 'toggle/follow/:id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async ToggleFollowState( @Param('id', ParseUUIDPipe) id:string, @GetUser()user)
    {
        const eventBus = EventBus.getInstance();
        //to-do Sync databases on follow/unfollow event instance

        const trainerResult = await this.trainerRepository.findTrainerById(id);
        if (!trainerResult.isSuccess())
        {
            throw new NotFoundException( trainerResult.Message );
        }
        const trainer = trainerResult.Value;

        //TEST
            console.log("Trainer found. Continuing...");
        
        let baseService:IApplicationService<TogggleTrainerFollowServiceEntryDto, ToggleTrainerFollowServiceResponseDto>;

        const doesFollowResult = await this.trainerRepository.checkIfFollowerExists(id, user.id);
        if (doesFollowResult.isSuccess())
        {
            const doesFollow = doesFollowResult.Value;
            if (doesFollow)
            {
                baseService = new UnfollowTrainerApplicationService(this.trainerRepository, eventBus);
            }
            else
            {
                baseService = new FollowTrainerApplicationService(this.trainerRepository, eventBus);
            }
        }

        const service = 
        new ExceptionDecorator(
            new LoggingDecorator(
                baseService,
                new NativeLogger( this.logger )
            ),
            new HttpExceptionHandler()
        );
        await service.execute({userId: user.id, trainer: trainer})
    }

    @Get('many')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Obtiene todos los entrenadores existentes. Se puede filtrar a sólo aquellos que el usuario está siguiendo', type: GetManyTrainersSwaggerResponseDto, isArray: true})
    //Gets all available trainers. May be filtered to only those that the user follows
    async GetManyTrainers(@Query() data:GetManyTrainersSwaggerEntryDto, @GetUser() user)
    {
        const pagination:PaginationDto = {page: data.page, perPage: data.perPage};
        let baseService:IApplicationService<GetManyTrainersServiceEntryDto, GetManyTrainersServiceResponseDto>;

        let doFollowFilter:boolean = false;
        if (data.userFollow != undefined)
        {
            //TEST
                console.log("Not undefined. Value string: ", data.userFollow);
            doFollowFilter = data.userFollow;
        }

        if (doFollowFilter == true)
        {
            baseService = new GetAllFollowedTrainersApplicationService( this.trainerRepository );
            //TEST
                console.log("Generated followers' filter");
        }
        else
        {
            baseService = new GetAllTrainersApplicationService( this.trainerRepository );
            //TEST
                console.log("Generated unfiltered service");
        }

        const service = 
        new ExceptionDecorator(
            new LoggingDecorator(
                baseService,
                new NativeLogger( this.logger )
            ),
            new HttpExceptionHandler()
        );

        const serviceDTO:GetManyTrainersServiceEntryDto = { userId: user.id, pagination: pagination };

        const responseResult = await service.execute(serviceDTO);
        const responseValue = responseResult.Value;
        //Map the fields of the DTO to the fields of the swagger response
        let responseTrainers:GetManyTrainersSwaggerResponseDto[] = [];
        for (const trainer of responseValue.trainers)
        {
            const responseTrainer = {
                id: trainer.id,
                name: trainer.name,
                location: trainer.location,
                followers: trainer.followerCount,
                userFollow: trainer.doesUserFollow
            }
            responseTrainers.push(responseTrainer);
        }
        return responseTrainers;
    }

    @Get('user/follow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({description: 'Obtiene la cantidad de entrenadores que el usuario está siguiendo', type: GetUserFollowingCountSwaggerResponseDto})
    //Gets the number of trainers that a given user follows
    async GetUserFollowingCount(@GetUser() user)
    {
        const service = 
        new ExceptionDecorator(
            new LoggingDecorator(
                new GetUserFollowingCountApplicationService( this.trainerRepository ),
                new NativeLogger( this.logger )
            ),
            new HttpExceptionHandler()
        );

        const countResult = await service.execute({userId: user.id});
        const followingCount = countResult.Value;
        return {count: followingCount.count};
    }
}