import { Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common"
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
import { UnfollowTrainerUserApplicationService } from "src/user/application/services/command/unfollow-trainer-user.application.service"
import { FollowTrainerUserApplicationService } from "src/user/application/services/command/follow-trainer-user.application.service"

@ApiTags('Trainer')
@Controller('trainer')
export class TrainerController {

    private readonly trainerRepository:OrmTrainerRepository;
    //Course and Blog coupling
    private readonly courseRepository:OrmCourseRepository;
    private readonly blogRepository:OrmBlogRepository;
    //CCC Logging
    private readonly logger:Logger = new Logger( "TrainerController" );

    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.trainerRepository = new OrmTrainerRepository(new OrmTrainerMapper(), dataSource);
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
    
    @Get( '/trainer/one/:id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve informacion sobre un entrenador, todos sus seguidores, cursos y blogs que haya creado; dado su id.', type: GetTrainerProfileSwaggerResponseDto})
    async getTrainerProfile( @Param('id', ParseUUIDPipe) id:string, @GetUser()user)
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

    @Post( '/trainer/toggle/follow/:id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Alterna el estado de "seguidor" entre un usuario y un entrenador'})
    async toggleFollowState( @Param('id', ParseUUIDPipe) id:string, @GetUser()user)
    {
        let baseService:IApplicationService<FollowUnfollowEntryDtoService, Trainer>; //to-do Maybe this should return some primitive type or DTO instead of trainer?

        const doesFollowResult = await this.trainerRepository.checkIfFollowerExists(id, user.id);
        if (doesFollowResult.isSuccess())
        {
            const doesFollow = doesFollowResult.Value;
            if (doesFollow)
            {
                baseService = new UnfollowTrainerUserApplicationService(this.trainerRepository);
            }
            else
            {
                baseService = new FollowTrainerUserApplicationService(this.trainerRepository);
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
        await service.execute({userId: user.id, trainerId: id})
    }
}