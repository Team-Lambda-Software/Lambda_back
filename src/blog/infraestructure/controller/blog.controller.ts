import { BadRequestException, Body, Controller, Get, Inject, Logger, NotFoundException, Param, ParseUUIDPipe, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { DataSource } from "typeorm"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { OrmBlogRepository } from "../repositories/orm-repositories/orm-blog-repository"
import { OrmBlogMapper } from "../mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogCommentMapper } from "../mappers/orm-mappers/orm-blog-comment-mapper"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { GetBlogSwaggerResponseDto } from "../dto/response/get-blog-swagger-response.dto"
import { SearchBlogsSwaggerResponseDto } from "../dto/response/search-blogs-swagger-response.dto"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { SearchBlogQueryParametersDto } from "../dto/queryParameters/search-blog-query-parameters.dto"
import { CreateBlogEntryDto } from "../dto/entry/create-blog-entry.dto"
import { CreateBlogApplicationService } from "src/blog/application/services/commands/create-blog-application.service"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { AuditingDecorator } from "src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator"
import { FilesInterceptor } from "@nestjs/platform-express"
import { AzureFileUploader } from "src/common/Infraestructure/azure-file-uploader/azure-file-uploader"
import { Result } from "src/common/Domain/result-handler/Result"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { EventBus } from "src/common/Infraestructure/event-bus/event-bus"
import { OdmBlogRepository } from "../repositories/odm-repository/odm-blog-repository"
import { BlogCreated } from "src/blog/domain/events/blog-created-event"
import { Model } from "mongoose"
import { OdmBlogEntity } from "../entities/odm-entities/odm-blog.entity"
import { InjectModel } from "@nestjs/mongoose"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { SearchRecentBlogsByCategoryService } from "../query-services/services/search-recent-blogs-by-category.service"
import { SearchBlogsByCategoryServiceEntryDto } from "../query-services/dto/params/search-blogs-by-category-service-entry.dto"
import { SearchMostPopularBlogsByCategoryService } from "../query-services/services/search-most-popular-blogs-by-category.service"
import { SearchBlogsByTrainerServiceEntryDto } from "../query-services/dto/params/search-blogs-by-trainer-service-entry.dto"
import { SearchMostPopularBlogsByTrainerService } from "../query-services/services/search-most-popular-blogs-by-trainer.service"
import { SearchRecentBlogsByTrainerService } from "../query-services/services/search-recent-blogs-by-trainer.service"
import { OdmBlogCommentEntity } from "../entities/odm-entities/odm-blog-comment.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { GetBlogService } from "../query-services/services/get-blog.service"
import { BlogQuerySyncronizer } from '../query-synchronizer/blog-query-synchronizer'
import { OdmCategoryRepository } from "src/categories/infraesctructure/repositories/odm-repositories/odm-category-repository"
import { GetBlogCountQueryParametersDto } from "../dto/queryParameters/get-blog-count-query-parameters.dto"
import { GetBlogCountService } from "../query-services/services/get-blog-count.service"
import { OdmTrainerRepository } from '../../../trainer/infraestructure/repositories/odm-repositories/odm-trainer-repository'
import { RabbitEventBus } from "src/common/Infraestructure/rabbit-event-bus/rabbit-event-bus"
import { OdmNotificationAddressEntity } from "src/notification/infraestructure/entities/odm-entities/odm-notification-address.entity"
import { OdmNotificationAlertEntity } from "src/notification/infraestructure/entities/odm-entities/odm-notification-alert.entity"
import { FirebaseNotifier } from "src/notification/infraestructure/notifier/firebase-notifier-singleton"
import { INotificationAddressRepository } from "src/notification/infraestructure/repositories/interface/notification-address-repository.interface"
import { INotificationAlertRepository } from "src/notification/infraestructure/repositories/interface/notification-alert-repository.interface"
import { OdmNotificationAddressRepository } from "src/notification/infraestructure/repositories/odm-notification-address-repository"
import { OdmNotificationAlertRepository } from "src/notification/infraestructure/repositories/odm-notification-alert-repository"
import { NewPublicationPushInfraService } from "src/notification/infraestructure/service/notification-service/new-publication-notification-service"


@ApiTags( 'Blog' )
@Controller( 'blog' )
export class BlogController
{
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly blogRepository: OrmBlogRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly odmBlogRepository: OdmBlogRepository
    private readonly odmTrainerRepository: OdmTrainerRepository
    private readonly odmCategoryRepository: OdmCategoryRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: AzureFileUploader
    private readonly blogQuerySyncronizer: BlogQuerySyncronizer
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( 
        @InjectModel('NotificationAddress') private addressModel: Model<OdmNotificationAddressEntity>,
        @InjectModel('NotificationAlert') private alertModel: Model<OdmNotificationAlertEntity>,
        @Inject( 'DataSource' ) private readonly dataSource: DataSource,
        @InjectModel('Blog') private blogModel: Model<OdmBlogEntity>,
        @InjectModel('Category') private categoryModel: Model<OdmCategoryEntity>,
        @InjectModel('Trainer') private trainerModel: Model<OdmTrainerEntity>,
        @InjectModel('BlogComment') private blogCommentModel: Model<OdmBlogCommentEntity>,
        @InjectModel('User') private userModel: Model<OdmUserEntity>)
    {
        this.notiAddressRepository = new OdmNotificationAddressRepository( addressModel )
        this.notiAlertRepository = new OdmNotificationAlertRepository( alertModel )
        this.blogRepository =
            new OrmBlogRepository(
                new OrmBlogMapper(),
                new OrmBlogCommentMapper(),
                dataSource
            )
        this.auditingRepository = new OrmAuditingRepository( dataSource )
        this.idGenerator = new UuidGenerator()
        this.fileUploader = new AzureFileUploader()

        this.odmBlogRepository = new OdmBlogRepository(
            blogModel,
            blogCommentModel
        )

        this.odmTrainerRepository = new OdmTrainerRepository( this.trainerModel )
        this.odmCategoryRepository = new OdmCategoryRepository( this.categoryModel )
        this.blogQuerySyncronizer = new BlogQuerySyncronizer(
            this.odmBlogRepository,
            this.blogModel,
            this.odmCategoryRepository,
            this.odmTrainerRepository
        )

        
    }


    @Post( 'create' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Crea un blog' } )
    @ApiConsumes( 'multipart/form-data' )
    @ApiBody( {
        schema: {
            type: 'object',
            properties: {
                trainerId: { type: 'integer' },
                title: { type: 'string' },
                body: { type: 'integer' },
                categoryId: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                images: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary"
                    }
                }
            },
        },
    } )
    @UseInterceptors( FilesInterceptor( 'images', 5 ) )
    async createBlog (@UploadedFiles() images: Express.Multer.File[] ,@GetUser() user, @Body() createBlogParams: CreateBlogEntryDto )
    {

        const eventBus = RabbitEventBus.getInstance();

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new LoggingDecorator(
                        new CreateBlogApplicationService(
                            this.blogRepository,
                            this.idGenerator,
                            this.fileUploader,
                            eventBus
                        ),
                        new NativeLogger( this.logger )
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )
        const newImages = []
        for ( const image of images ){
            const newImage = new File( [image.buffer], image.originalname, {type: image.mimetype})
            newImages.push(newImage)
            if ( !['png','jpg','jpeg'].includes(image.originalname.split('.').pop())){
                return Result.fail( new Error("Invalid image format"), 400, "Invalid image format" )
            }
        }
        const category = await this.odmCategoryRepository.findCategoryById( createBlogParams.categoryId )
        if ( !category.Value )
        {
            throw new NotFoundException( category.Message )
        }
        const trainer = await this.odmTrainerRepository.findTrainerById( createBlogParams.trainerId )
        if ( !trainer.isSuccess() )
        {
            throw new NotFoundException( trainer.Message )
        }
        const result = await service.execute( { images: newImages, ...createBlogParams, userId: user.id } )
        eventBus.subscribe('BlogCreated', async (event: BlogCreated) => {
            this.blogQuerySyncronizer.execute(event)
            const pushService = new NewPublicationPushInfraService(
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.idGenerator,
                FirebaseNotifier.getInstance() ,
                this.odmTrainerRepository
            )
            pushService.execute( { userId:'', publicationName: event.title, trainerId: event.trainerId, publicationType: 'Blog' } )
        
        })
        return result.Value
    }


    @Get( 'one/:id' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de un blog dado el id', type: GetBlogSwaggerResponseDto } )
    async getBlog ( @Param( 'id', ParseUUIDPipe ) id: string, @GetUser() user )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetBlogService(
                        this.odmBlogRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            )
        const result = await service.execute( { blogId: id, userId: user.id } )
        return result.Value
    }

    @Get( 'many' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de los blogs', type: SearchBlogsSwaggerResponseDto, isArray: true } )
    async searchBlogs ( @GetUser() user, @Query() searchBlogParams: SearchBlogQueryParametersDto )
    {

        if ( ( searchBlogParams.category || ( !searchBlogParams.category && !searchBlogParams.trainer ) ) )
        {
            const searchBlogServiceEntry: SearchBlogsByCategoryServiceEntryDto = { categoryId: searchBlogParams.category, userId: user.id, pagination: { page: searchBlogParams.page, perPage: searchBlogParams.perPage } }

            if ( searchBlogParams.filter == 'POPULAR' )
            {
                const service =
                    new ExceptionDecorator(
                        new LoggingDecorator(
                            new SearchMostPopularBlogsByCategoryService(
                                this.odmBlogRepository
                            ),
                            new NativeLogger( this.logger )
                        ),
                        new HttpExceptionHandler()
                    )
                const result = await service.execute( searchBlogServiceEntry )

                return result.Value
            } else
            {
                const service =
                    new ExceptionDecorator(
                        new LoggingDecorator(
                            new SearchRecentBlogsByCategoryService(
                                this.odmBlogRepository
                            ),
                            new NativeLogger( this.logger )
                        ),
                        new HttpExceptionHandler()
                    )
                const result = await service.execute( searchBlogServiceEntry )

                return result.Value
            }

        }

        const searchBlogServiceEntry: SearchBlogsByTrainerServiceEntryDto = { trainerId: searchBlogParams.trainer, userId: user.id, pagination: { page: searchBlogParams.page, perPage: searchBlogParams.perPage } }

        if ( searchBlogParams.filter == 'POPULAR' )
        {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchMostPopularBlogsByTrainerService(
                            this.odmBlogRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( searchBlogServiceEntry )

            return result.Value
        } else
        {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchRecentBlogsByTrainerService(
                            this.odmBlogRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( searchBlogServiceEntry )

            return result.Value
        }


    }

    @Get( 'count' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la cantidad de blogs', type: Number } )
    async getBlogcount ( @GetUser() user, @Query() getBlogCountParams: GetBlogCountQueryParametersDto )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetBlogCountService(
                        this.odmBlogRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            )
        if (!getBlogCountParams.category && !getBlogCountParams.trainer){
            throw new BadRequestException("tiene que enviar o un entrenador o una categoria")
        }
        const result = await service.execute( {...getBlogCountParams, userId: user.id})
        return result.Value
    }

}