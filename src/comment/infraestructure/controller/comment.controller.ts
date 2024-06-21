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
import { User } from "src/user/domain/user"
import { DataSource, In } from "typeorm"
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
import { BlogComment } from "src/blog/domain/entities/blog-comment"
import { OdmBlogCommentEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog-comment.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { GetBlogCommentsServiceEntryDto } from "src/blog/infraestructure/query-services/dto/params/get-blog-comments-service-entry.dto"
import { GetBlogCommentsService } from "src/blog/infraestructure/query-services/services/get-blog-comments.service"
import { Blog } from "src/blog/domain/blog"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { BlogTitle } from "src/blog/domain/value-objects/blog-title"
import { BlogBody } from "src/blog/domain/value-objects/blog-body"
import { BlogPublicationDate } from "src/blog/domain/value-objects/blog-publication-date"
import { BlogImage } from "src/blog/domain/value-objects/blog-image"
import { Trainer } from "src/trainer/domain/trainer"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { BlogTag } from "src/blog/domain/value-objects/blog-tag"
import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { OdmCourseRepository } from "src/course/infraestructure/repositories/odm-repositories/odm-course-repository"
import { SectionCommentCreated } from "src/course/domain/events/section-comment-created-event"
import { SectionComment } from "src/course/domain/entities/section-comment/section-comment"
import { GetSectionCommentsServiceEntryDto } from "src/course/infraestructure/query-services/dto/param/get-section-comments-service-entry.dto"
import { GetSectionCommentsService } from "src/course/infraestructure/query-services/services/get-section-comments.service"



@ApiTags( 'Comment' )
@Controller( 'comment' )
export class CommentController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly blogRepository: OrmBlogRepository
    private readonly userRepository: OrmUserRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly odmBlogRepository: OdmBlogRepository
    private readonly odmCourseRepository: OdmCourseRepository
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
        
        this.odmBlogRepository = new OdmBlogRepository(
            blogModel,
            categoryModel,
            trainerModel,
            blogCommentModel,
            userModel
        )

        this.odmCourseRepository = new OdmCourseRepository(
            courseModel,
            sectionCommentModel,
            categoryModel,
            trainerModel,
            userModel
        )
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
                userId: user.Id
            } 
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new GetSectionCommentsService(
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
        const eventBus = EventBus.getInstance();
        if ( targetType === 'LESSON' )
        {
            eventBus.subscribe('SectionCommentCreated', async (event: SectionCommentCreated) => {
                this.odmCourseRepository.addCommentToSection(SectionComment.create(event.id, event.userId, event.text, event.date, event.sectionId))
            })
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
                sectionId: target, userId: user.Id,
                comment: body
            }
            const result = await service.execute( data )
            return
        } else
        {
            const eventBus = EventBus.getInstance();
            eventBus.subscribe('BlogCommentCreated', async (event: BlogCommentCreated) => {
                this.odmBlogRepository.createBlogComment(BlogComment.create(event.id, event.userId, event.text, event.date, event.blogId))
            })
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
            const blog = await this.odmBlogRepository.findBlogById(target)
            if (!blog){
                throw new NotFoundException('No se encontro el blog')
            }
            const resultBlog = blog.Value
            const data: AddCommentToBlogServiceEntryDto = {
                blog: Blog.create(BlogId.create(resultBlog.id), BlogTitle.create(resultBlog.title), BlogBody.create(resultBlog.body), resultBlog.images.map(image => BlogImage.create(image.url)), BlogPublicationDate.create(resultBlog.publication_date), Trainer.create(resultBlog.trainer.id, resultBlog.trainer.first_name, resultBlog.trainer.first_last_name, resultBlog.trainer.second_last_name, resultBlog.trainer.email, resultBlog.trainer.phone, resultBlog.trainer.followers.map(follower => follower.id), resultBlog.trainer.latitude, resultBlog.trainer.longitude), CategoryId.create(resultBlog.category.id), resultBlog.tags.map(tag => BlogTag.create(tag))), 
                userId: user.Id,
                comment: body
            }
            const result = await service.execute( data )
            return
        }
    }


}