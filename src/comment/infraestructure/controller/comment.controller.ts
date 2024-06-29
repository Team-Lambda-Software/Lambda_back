import { BadRequestException, Body, Controller, Get, Inject, Logger, NotFoundException, Post, Query, UseGuards } from "@nestjs/common"
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
import { DataSource } from "typeorm"
import { AddCommentEntryDto } from "../dto/entry/add-comment-entry.dto"
import { AddCommentToSectionServiceEntryDto } from "src/course/application/dto/param/add-comment-to-section-service-entry.dto"
import { AddCommentToBlogApplicationService } from "src/blog/application/services/commands/add-comment-to-blog-application.service"
import { OrmBlogRepository } from "src/blog/infraestructure/repositories/orm-repositories/orm-blog-repository"
import { OrmBlogMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogCommentMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-comment-mapper"
import { AddCommentToBlogServiceEntryDto } from "src/blog/application/dto/params/add-comment-to-blog-service-entry.dto"
import { GetAllCommentsQueryParametersDto } from "../dto/queryParameters/get-all-comments-query-parameters.dto"
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository"
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper"
import { GetAllCommentsSwaggerResponseDto } from "../dto/response/get-all-comments-swagger-response.dto"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { EventBus } from "src/common/Infraestructure/event-bus/event-bus"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { OdmBlogEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmBlogRepository } from "src/blog/infraestructure/repositories/odm-repository/odm-blog-repository"
import { BlogCommentCreated } from "src/blog/domain/events/blog-comment-created-event"
import { OdmBlogCommentEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog-comment.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { GetBlogCommentsServiceEntryDto } from "src/blog/infraestructure/query-services/dto/params/get-blog-comments-service-entry.dto"
import { GetBlogCommentsService } from "src/blog/infraestructure/query-services/services/get-blog-comments.service"

import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { OdmCourseRepository } from "src/course/infraestructure/repositories/odm-repositories/odm-course-repository"
import { SectionCommentCreated } from "src/course/domain/events/section-comment-created-event"
import { GetSectionCommentsServiceEntryDto } from "src/course/infraestructure/query-services/dto/param/get-section-comments-service-entry.dto"
import { GetSectionCommentsService } from "src/course/infraestructure/query-services/services/get-section-comments.service"
import { Section } from "src/course/domain/entities/section/section"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionName } from "src/course/domain/entities/section/value-objects/section-name"
import { SectionDescription } from "src/course/domain/entities/section/value-objects/section-description"
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration"
import { SectionVideo } from "src/course/domain/entities/section/value-objects/section-video"
import { OdmCourseMapper } from "src/course/infraestructure/mappers/odm-mappers/odm-course-mapper"
import { OdmBlogMapper } from "src/blog/infraestructure/mappers/odm-mappers/odm-blog-mapper"
import { BlogCommentQuerySyncronizer } from "src/blog/infraestructure/query-synchronizer/blog-comment-query-synchronizer"
import { SectionCommentQuerySyncronizer } from '../../../course/infraestructure/query-synchronizers/section-comment-query-synchronizer'
import { OdmUserRepository } from '../../../user/infraestructure/repositories/odm-repository/odm-user-repository';
import { RabbitEventBus } from "src/common/Infraestructure/rabbit-event-bus/rabbit-event-bus"


@ApiTags( 'Comment' )
@Controller( 'comment' )
export class CommentController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly blogRepository: OrmBlogRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly odmBlogRepository: OdmBlogRepository
    private readonly odmCourseRepository: OdmCourseRepository
    private readonly odmUserRepository: OdmUserRepository
    private readonly odmCourseMapper: OdmCourseMapper
    private readonly odmBlogMapper: OdmBlogMapper
    private readonly blogCommentQuerySynchronizer: BlogCommentQuerySyncronizer
    private readonly sectionCommentQuerySyncronizer: SectionCommentQuerySyncronizer
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource, 
            @InjectModel('Blog') private blogModel: Model<OdmBlogEntity>,
            @InjectModel('Category') private categoryModel: Model<OdmCategoryEntity>,
            @InjectModel('Trainer') private trainerModel: Model<OdmTrainerEntity>,
            @InjectModel('BlogComment') private blogCommentModel: Model<OdmBlogCommentEntity>,
            @InjectModel('User') private userModel: Model<OdmUserEntity>,
            @InjectModel('SectionComment') private sectionCommentModel: Model<OdmSectionCommentEntity>,
            @InjectModel('Course') private courseModel: Model<OdmCourseEntity> )
    {
        this.courseRepository =
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper()),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            )
        this.blogRepository = new OrmBlogRepository(
            new OrmBlogMapper(),
            new OrmBlogCommentMapper(),
            dataSource
        )

        this.auditingRepository = new OrmAuditingRepository( dataSource )

        this.idGenerator = new UuidGenerator()

        
        this.odmBlogRepository = new OdmBlogRepository(
            blogModel,
            blogCommentModel
        )

        this.odmCourseRepository = new OdmCourseRepository(
            courseModel,
            sectionCommentModel
        )

        this.odmCourseMapper = new OdmCourseMapper()
        this.odmBlogMapper = new OdmBlogMapper()

        this.odmUserRepository = new OdmUserRepository(userModel)

        this.blogCommentQuerySynchronizer = new BlogCommentQuerySyncronizer(
            this.odmBlogRepository,
            blogCommentModel,
            this.odmUserRepository
        )
        this.sectionCommentQuerySyncronizer = new SectionCommentQuerySyncronizer(
            this.odmCourseRepository,
            sectionCommentModel,
            this.odmUserRepository
        )
    }

    @Get( 'many' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Obtiene todos los comentarios de donde lo solicites', type: GetAllCommentsSwaggerResponseDto, isArray: true} )
    async getComments (@GetUser() user, @Query() getCommentsQueryParams: GetAllCommentsQueryParametersDto)
    {
        if (getCommentsQueryParams.blog){
            const data: GetBlogCommentsServiceEntryDto = {
                blogId: getCommentsQueryParams.blog,
                pagination: {page: getCommentsQueryParams.page, perPage: getCommentsQueryParams.perPage},
                userId: user.id
            } 
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new GetBlogCommentsService(
                            this.odmBlogRepository
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
                userId: user.id
            } 
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new GetSectionCommentsService(
                            this.odmCourseRepository
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
    async addComment ( @Body() entryData: AddCommentEntryDto, @GetUser() user )
    {
        const { target, targetType, body } = entryData
        const eventBus = RabbitEventBus.getInstance();
        
        if ( targetType === 'LESSON' )
        {
    
            const service =
                new ExceptionDecorator(
                    new AuditingDecorator(
                        new LoggingDecorator(
                            new AddCommentToSectionApplicationService(
                                this.courseRepository,
                                this.idGenerator,
                                eventBus
                            ),
                            new NativeLogger( this.logger )
                        ),
                        this.auditingRepository,
                        this.idGenerator
                    ),
                    new HttpExceptionHandler()
                )

            const data: AddCommentToSectionServiceEntryDto = {
                sectionId: target, userId: user.id,
                comment: body
            }
            const result = await service.execute( data )
            eventBus.subscribe('SectionCommentCreated', async (event: SectionCommentCreated) => {
                this.sectionCommentQuerySyncronizer.execute(event)
            })
            return
        } else
        {
            const eventBus = RabbitEventBus.getInstance();
             
            const service =
                new ExceptionDecorator(
                    new AuditingDecorator(
                        new LoggingDecorator(
                            new AddCommentToBlogApplicationService(
                                this.blogRepository,
                                this.idGenerator,
                                eventBus
                            ),
                            new NativeLogger( this.logger )
                        ),
                        this.auditingRepository,
                        this.idGenerator
                    ),
                    new HttpExceptionHandler()
                )

            const data: AddCommentToBlogServiceEntryDto = {
                blogId: target, 
                userId: user.id,
                comment: body
            }
            const result = await service.execute( data )

            eventBus.subscribe('BlogCommentCreated', async (event: BlogCommentCreated) => {
                this.blogCommentQuerySynchronizer.execute(event)
            })
            return
        }
    }


}