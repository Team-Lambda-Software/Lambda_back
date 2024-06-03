import { BadRequestException, Body, Controller, Get, Inject, Logger, Post, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { AuditingDecorator } from "src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { AddCommentToSectionApplicationService } from "src/course/application/services/commands/add-comment-to-section-application.service"
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper"
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper"
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper"
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { User } from "src/user/domain/user"
import { DataSource } from "typeorm"
import { AddCommentEntryDto } from "../dto/entry/add-comment-entry.dto"
import { AddCommentToSectionServiceEntryDto } from "src/course/application/dto/param/add-comment-to-section-service-entry.dto"
import { AddCommentToBlogApplicationService } from "src/blog/application/services/commands/add-comment-to-blog-application.service"
import { OrmBlogRepository } from "src/blog/infraestructure/repositories/orm-repositories/orm-blog-repository"
import { OrmBlogMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogCommentMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-comment-mapper"
import { AddCommentToBlogServiceEntryDto } from "src/blog/application/dto/params/add-comment-to-blog-service-entry.dto"
import { GetAllCommentsQueryParametersDto } from "../dto/queryParameters/get-all-comments-query-parameters.dto"
import { GetBlogCommentsServiceEntryDto } from "src/blog/application/dto/params/get-blog-comments-service-entry.dto"
import { GetBlogCommentsApplicationService } from "src/blog/application/services/queries/get-blog-comments.service"
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository"
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper"
import { GetSectionCommentsApplicationService } from "src/course/application/services/queries/get-section-comments.service"
import { GetSectionCommentsServiceEntryDto } from "src/course/application/dto/param/get-section-comments-service-entry.dto"
import { GetAllCommentsSwaggerResponseDto } from "../dto/response/get-all-comments-swagger-response.dto"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"



@ApiTags( 'Comment' )
@Controller( 'comment' )
export class CommentController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly blogRepository: OrmBlogRepository
    private readonly userRepository: OrmUserRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly idGenerator: IdGenerator<string>
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
        this.blogRepository = new OrmBlogRepository(
            new OrmBlogMapper(
                new OrmTrainerMapper()
            ),
            new OrmBlogCommentMapper(),
            dataSource
        )

        this.auditingRepository = new OrmAuditingRepository( dataSource )

        this.idGenerator = new UuidGenerator()

        this.userRepository = new OrmUserRepository( 
            new OrmUserMapper(),
            dataSource )


    }

    @Get( 'many' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Obtiene todos los comentarios de donde lo solicites', type: GetAllCommentsSwaggerResponseDto, isArray: true} )
    async getComments (@GetUser() user: User, @Query() getCommentsQueryParams: GetAllCommentsQueryParametersDto)
    {
        if (getCommentsQueryParams.blog){
            const data: GetBlogCommentsServiceEntryDto = {
                blogId: getCommentsQueryParams.blog,
                pagination: {page: getCommentsQueryParams.page, perPage: getCommentsQueryParams.perPage},
                userId: user.Id
            } 
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new GetBlogCommentsApplicationService(
                            this.blogRepository,
                            this.userRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( data )
            return result.Value
        } else if (getCommentsQueryParams.lesson){
            const data: GetSectionCommentsServiceEntryDto = {
                sectionId: getCommentsQueryParams.lesson,
                pagination: {page: getCommentsQueryParams.page, perPage: getCommentsQueryParams.perPage},
                userId: user.Id
            } 
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new GetSectionCommentsApplicationService(
                            this.courseRepository,
                            this.userRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( data )
            return result.Value
        }
        throw new BadRequestException('Por favor indique o un blog o una leccion para obtener los comentarios')
    }

    @Post( 'release' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Agrega un comentario' } )
    async addComment ( @Body() entryData: AddCommentEntryDto, @GetUser() user: User )
    {
        const { target, targetType, body } = entryData

        if ( targetType === 'LESSON' )
        {
            const service =
                new ExceptionDecorator(
                    new AuditingDecorator(
                        new LoggingDecorator(
                            new AddCommentToSectionApplicationService(
                                this.courseRepository,
                                this.idGenerator
                            ),
                            new NativeLogger( this.logger )
                        ),
                        this.auditingRepository,
                        this.idGenerator
                    ),
                    new HttpExceptionHandler()
                )

            const data: AddCommentToSectionServiceEntryDto = {
                sectionId: target, userId: user.Id,
                comment: body
            }
            const result = await service.execute( data )
            return
        } else
        {
            const service =
                new ExceptionDecorator(
                    new AuditingDecorator(
                        new LoggingDecorator(
                            new AddCommentToBlogApplicationService(
                                this.blogRepository,
                                this.idGenerator
                            ),
                            new NativeLogger( this.logger )
                        ),
                        this.auditingRepository,
                        this.idGenerator
                    ),
                    new HttpExceptionHandler()
                )

            const data: AddCommentToBlogServiceEntryDto = {
                blogId: target, userId: user.Id,
                comment: body
            }
            const result = await service.execute( data )
            return
        }
    }


}