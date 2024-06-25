import { BadRequestException, Body, Controller, Get, Inject, Logger, NotFoundException, Param, ParseUUIDPipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { DataSource } from "typeorm"
import { OrmCourseRepository } from "../repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "../mappers/orm-mappers/orm-course-mapper"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { OrmSectionMapper } from "../mappers/orm-mappers/orm-section-mapper"
import { OrmSectionCommentMapper } from "../mappers/orm-mappers/orm-section-comment-mapper"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { GetCourseSwaggerResponseDto } from "../dto/responses/get-course-swagger-response.dto"
import { SearchCoursesSwaggerResponseDto } from "../dto/responses/search-courses-swagger-response.dto"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { OrmProgressCourseRepository } from '../../../progress/infraestructure/repositories/orm-repositories/orm-progress-course-repository'
import { OrmProgressCourseMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-course-mapper"
import { OrmProgressSectionMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-section-mapper"
//import { OrmProgressVideoMapper } from "src/progress/infraestructure/mappers/orm-mappers/orm-progress-video-mapper"
import { SearchCourseQueryParametersDto } from "../dto/queryParameters/search-course-query-parameters.dto"
import { OrmTrainerRepository } from "src/trainer/infraestructure/repositories/orm-repositories/orm-trainer-repository"
import { CreateCourseApplicationService } from "src/course/application/services/commands/create-course-application.service"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { AuditingDecorator } from "src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator"
import { CreateCourseEntryDto } from "../dto/entry/create-course-entry.dto"
import { AddSectionToCourseApplicationService } from "src/course/application/services/commands/add-section-to-course-application.service"
import { AddSectionToCourseEntryDto } from "../dto/entry/add-section-to-course-entry.dto"
import { AzureFileUploader } from '../../../common/Infraestructure/azure-file-uploader/azure-file-uploader'
import { FileInterceptor } from "@nestjs/platform-express"
import { FileExtender } from "src/common/Infraestructure/interceptors/file-extender"
import { Result } from "src/common/Domain/result-handler/Result"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { CreateCourseSwaggerResponseDto } from "../dto/responses/create-course-swagger-response.dto"
import { AddSectionToCourseResponseDto } from "../dto/responses/add-section-to-course-response.dto"
import { EventBus } from "src/common/Infraestructure/event-bus/event-bus"
import { OdmCourseRepository } from '../repositories/odm-repositories/odm-course-repository'
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { OdmCourseEntity } from "../entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "../entities/odm-entities/odm-section-comment.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { CourseCreated } from "src/course/domain/events/course-created-event"
import { SectionCreated } from "src/course/domain/events/section-created-event"
import { GetCourseService } from "../query-services/services/get-course.service"
import { SearchCoursesByCategoryServiceEntryDto } from "../query-services/dto/param/search-courses-by-category-service-entry.dto"
import { SearchMostPopularCoursesByCategoryService } from "../query-services/services/search-most-popular-courses-by-category.service"
import { SearchRecentCoursesByCategoryService } from "../query-services/services/search-recent-courses-by-category.service"
import { SearchCoursesByTrainerServiceEntryDto } from "../query-services/dto/param/search-courses-by-trainer-service-entry.dto"
import { SearchMostPopularCoursesByTrainerService } from "../query-services/services/search-most-popular-courses-by-trainer.service"
import { SearchRecentCoursesByTrainerService } from "../query-services/services/search-recent-courses-by-trainer.service"
import { OdmCategoryRepository } from "src/categories/infraesctructure/repositories/odm-repositories/odm-category-repository"
import { Category } from "src/categories/domain/categories"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { CategoryName } from "src/categories/domain/value-objects/category-title"
import { CategoryIcon } from "src/categories/domain/value-objects/category-image"
import { OdmCourseMapper } from "../mappers/odm-mappers/odm-course-mapper"
import { CourseQuerySyncronizer } from '../query-synchronizers/course-query-synchronizer'
import { SectionQuerySyncronizer } from '../query-synchronizers/section-query-synchronizer'
import { GetCourseCountQueryParametersDto } from "../dto/queryParameters/get-course-count-query-parameters.dto"
import { GetCourseCountService } from "../query-services/services/get-course-count.service"
import { OdmTrainerRepository } from '../../../trainer/infraestructure/repositories/odm-repositories/odm-trainer-repository'
import { OdmTrainerMapper } from '../../../trainer/infraestructure/mappers/odm-mapper/odm-trainer-mapper'


@ApiTags( 'Course' )
@Controller( 'course' )
export class CourseController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly progressRepository: OrmProgressCourseRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly odmCategoryRepository: OdmCategoryRepository
    private readonly trainerRepository: OrmTrainerRepository
    private readonly odmCourseRepository: OdmCourseRepository
    private readonly odmTrainerRepository: OdmTrainerRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: AzureFileUploader
    private readonly odmCourseMapper: OdmCourseMapper
    private readonly odmTrainerMapper: OdmTrainerMapper
    private readonly courseQuerySyncronizer: CourseQuerySyncronizer
    private readonly sectionQuerySyncronizer: SectionQuerySyncronizer
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource,
        @InjectModel( 'Course' ) private readonly courseModel: Model<OdmCourseEntity>,
        @InjectModel( 'SectionComment' ) private readonly sectionCommentModel: Model<OdmSectionCommentEntity>,
        @InjectModel( 'Category' ) private readonly categoryModel: Model<OdmCategoryEntity>,
        @InjectModel( 'Trainer' ) private readonly trainerModel: Model<OdmTrainerEntity>,
        @InjectModel( 'User' ) private readonly userModel: Model<OdmUserEntity> )
    {
        this.courseRepository =
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper()
                ),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            )
        this.progressRepository =
            new OrmProgressCourseRepository(
                new OrmProgressCourseMapper(),
                new OrmProgressSectionMapper(),
                this.courseRepository,
                dataSource,
                new UuidGenerator() )
        this.auditingRepository = new OrmAuditingRepository( dataSource )

        this.trainerRepository = new OrmTrainerRepository(
            new OrmTrainerMapper(),
            dataSource
        )

        this.idGenerator = new UuidGenerator()

        this.fileUploader = new AzureFileUploader()

        this.odmCourseRepository = new OdmCourseRepository( this.courseModel, this.sectionCommentModel)

        this.odmCourseMapper = new OdmCourseMapper()

        this.odmTrainerRepository = new OdmTrainerRepository( this.trainerModel )
        this.odmCategoryRepository = new OdmCategoryRepository( this.categoryModel )
        this.courseQuerySyncronizer = new CourseQuerySyncronizer(
            this.odmCourseRepository,
            this.courseModel,
            this.odmCategoryRepository,
            this.odmTrainerRepository
        )

        this.odmTrainerMapper = new OdmTrainerMapper()

        this.sectionQuerySyncronizer = new SectionQuerySyncronizer(
            this.odmCourseRepository
        )

        
    }

    @Post( 'create' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Crea un curso', type: CreateCourseSwaggerResponseDto } )
    @ApiConsumes( 'multipart/form-data' )
    @ApiBody( {
        schema: {
            type: 'object',
            properties: {
                trainerId: { type: 'string' },
                name: { type: 'integer' },
                description: { type: 'string' },
                weeksDuration: { type: 'integer' },
                minutesDuration: { type: 'integer' },
                level: { type: 'integer' },
                categoryId: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    } )
    @UseInterceptors( FileExtender )
    @UseInterceptors( FileInterceptor( 'image' ) )
    async createCourse ( @UploadedFile() image: Express.Multer.File, @Body() createCourseServiceEntryDto: CreateCourseEntryDto, @GetUser() user )
    {
        const eventBus = EventBus.getInstance()
        
        eventBus.subscribe( 'CourseCreated', async ( event: CourseCreated ) =>{
            this.courseQuerySyncronizer.execute( event )
        })

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new LoggingDecorator(
                        new CreateCourseApplicationService(
                            this.courseRepository,
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
        if ( ![ 'png', 'jpg', 'jpeg' ].includes( image.originalname.split( '.' ).pop() ) )
        {
            return Result.fail( new Error( "Invalid image format" ), 400, "Invalid image format" )
        }
        const newImage = new File( [ image.buffer ], image.originalname, { type: image.mimetype } )
        const category = await this.odmCategoryRepository.findCategoryById( createCourseServiceEntryDto.categoryId )
        if ( !category.Value )
        {
            throw new NotFoundException( category.Message )
        }
        const resultCategory = Category.create(CategoryId.create(category.Value.id), 
        CategoryName.create(category.Value.categoryName), CategoryIcon.create(category.Value.icon))
        const trainer = await this.odmTrainerRepository.findTrainerById( createCourseServiceEntryDto.trainerId )
        if ( !trainer.isSuccess() )
        {
            throw new NotFoundException( trainer.Message )
        }
        const resultTrainer = await this.odmTrainerMapper.fromPersistenceToDomain(trainer.Value)
        const result = await service.execute( { image: newImage, ...createCourseServiceEntryDto, userId: user.id, category: resultCategory, trainer: resultTrainer} )
        return result.Value
    }

    @Post( 'add-section/:courseId' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Agrega una seccion a un curso', type: AddSectionToCourseResponseDto } )
    @ApiConsumes( 'multipart/form-data' )
    @ApiBody( {
        schema: {
            type: 'object',
            properties: {
                name: { type: 'integer' },
                description: { type: 'string' },
                duration: { type: 'integer' },
                paragraph: { type: 'string' },

                file: {
                    type: 'string',
                    format: 'binary',
                }
            },
        },
    } )
    @UseInterceptors( FileExtender )
    @UseInterceptors( FileInterceptor( 'file' ) )
    async addSectionToCourse ( @UploadedFile() file: Express.Multer.File, @Param( 'courseId', ParseUUIDPipe ) courseId: string, @Body() addSectionToCourseEntryDto: AddSectionToCourseEntryDto, @GetUser() user )
    {
        const eventBus = EventBus.getInstance()

        eventBus.subscribe( 'SectionCreated', async (event: SectionCreated) => {
            this.sectionQuerySyncronizer.execute(event)
        })

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new LoggingDecorator(
                        new AddSectionToCourseApplicationService(
                            this.courseRepository,
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
        let fileType = null
        let newFile = null
        if ( file )
        {
            newFile = new File( [ file.buffer ], file.originalname, { type: file.mimetype } )
            if ( ![ 'mp4' ].includes( file.originalname.split( '.' ).pop() ) )
            {
                return Result.fail( new Error( "Invalid file format (videos in mp4, images in png, jpg or jpeg)" ), 400, "Invalid file format (videos in mp4, images in png, jpg or jpeg)" )
            }
        }

        const course = await this.odmCourseRepository.findCourseById( courseId )
        if (!course.Value){
            throw new NotFoundException('No se encontro el curso')
        }
        const resultCourse = await this.odmCourseMapper.fromPersistenceToDomain(course.Value)

        const result = await service.execute( { file: newFile, ...addSectionToCourseEntryDto, course: resultCourse, userId: user.id } )
        return result.Value
    }

    @Get( 'one/:id' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de un curso dado el id', type: GetCourseSwaggerResponseDto } )
    async getCourse ( @Param( 'id', ParseUUIDPipe ) id: string, @GetUser() user )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseService(
                        this.odmCourseRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            )
        const result = await service.execute( { courseId: id, userId: user.id } )
        return result.Value
    }

    @Get( 'many' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de los cursos', type: SearchCoursesSwaggerResponseDto, isArray: true } )
    async searchCourses ( @GetUser() user, @Query() searchCourseParams: SearchCourseQueryParametersDto )
    {

        if ( ( searchCourseParams.category || ( !searchCourseParams.category && !searchCourseParams.trainer ) ) )
        {
            const searchCourseServiceEntry: SearchCoursesByCategoryServiceEntryDto = { categoryId: searchCourseParams.category, userId: user.id, pagination: { page: searchCourseParams.page, perPage: searchCourseParams.perPage } }

            if ( searchCourseParams.filter == 'POPULAR' )
            {
                const service =
                    new ExceptionDecorator(
                        new LoggingDecorator(
                            new SearchMostPopularCoursesByCategoryService(
                                this.odmCourseRepository,
                                this.progressRepository
                            ),
                            new NativeLogger( this.logger )
                        ),
                        new HttpExceptionHandler()
                    )
                const result = await service.execute( searchCourseServiceEntry )

                return result.Value
            } else
            {
                const service =
                    new ExceptionDecorator(
                        new LoggingDecorator(
                            new SearchRecentCoursesByCategoryService(
                                this.odmCourseRepository,
                            ),
                            new NativeLogger( this.logger )
                        ),
                        new HttpExceptionHandler()
                    )
                const result = await service.execute( searchCourseServiceEntry )

                return result.Value
            }

        }

        const searchCourseServiceEntry: SearchCoursesByTrainerServiceEntryDto = { trainerId: searchCourseParams.trainer, userId: user.id, pagination: { page: searchCourseParams.page, perPage: searchCourseParams.perPage } }

        if ( searchCourseParams.filter == 'POPULAR' )
        {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchMostPopularCoursesByTrainerService(
                            this.odmCourseRepository,
                            this.progressRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( searchCourseServiceEntry )

            return result.Value
        } else
        {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchRecentCoursesByTrainerService(
                            this.odmCourseRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( searchCourseServiceEntry )

            return result.Value
        }


    }

    @Get( 'count' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la cantidad de courses', type: Number } )
    async getCoursecount ( @GetUser() user, @Query() getCourseCountParams: GetCourseCountQueryParametersDto )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseCountService(
                        this.odmCourseRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            )
        if (!getCourseCountParams.category && !getCourseCountParams.trainer){
            throw new BadRequestException("tiene que enviar o un entrenador o una categoria")
        }
        const result = await service.execute( {...getCourseCountParams, userId: user.id})
        return result.Value
    }


    // @Post( 'levels/search' )
    // @UseGuards( JwtAuthGuard )
    // @ApiBearerAuth()
    // @ApiOkResponse( { description: 'Devuelve la informacion de los cursos que tengan alguno de los niveles dados', type: SearchCoursesSwaggerResponseDto, isArray: true } )
    // async searchCourseBylevels ( @Body() searchCourseByLevelsEntryDto: SearchCourseByLevelsEntryDto, @GetUser() user: User, @Query() pagination: PaginationDto )
    // {
    //     const searchCourseByLevelsServiceEntry: SearchCourseByLevelsServiceEntryDto = { ...searchCourseByLevelsEntryDto, userId: user.Id, pagination: pagination }
    //     const service =
    //         new ExceptionDecorator(
    //             new LoggingDecorator(
    //                 new SearchCourseByLevelsApplicationService(
    //                     this.courseRepository
    //                 ),
    //                 new NativeLogger( this.logger )
    //             )
    //         )
    //     const result = await service.execute( searchCourseByLevelsServiceEntry )

    //     return result.Value
    // }

}