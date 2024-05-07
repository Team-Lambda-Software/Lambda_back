import { Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common"
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
    
    @Get( ':id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve informacion sobre un entrenador, todos sus seguidores, cursos y blogs que haya creado; dado su id.', type: GetTrainerProfileSwaggerResponseDto})
    async getTrainerProfile( @Param('id', ParseUUIDPipe) id:string, @GetUser()user:User, @Query('CoursePagination')coursePagination:PaginationDto, @Query('BlogPagination')blogPagination:PaginationDto )
    {
        const service = 
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetTrainerProfileApplicationService(
                        this.trainerRepository,
                        this.blogRepository,
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            );
        const result = await service.execute( {userId: user.Id, trainerId:id, coursesPagination:coursePagination, blogsPagination:blogPagination} );
        return result.Value;
    }
}