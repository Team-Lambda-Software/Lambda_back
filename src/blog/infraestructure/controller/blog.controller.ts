import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { DataSource } from "typeorm"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { OrmBlogRepository } from "../repositories/orm-repositories/orm-blog-repository"
import { OrmBlogMapper } from "../mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogCommentMapper } from "../mappers/orm-mappers/orm-blog-comment-mapper"
import { GetBlogApplicationService } from "src/blog/application/services/queries/get-blog.service"
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { GetBlogSwaggerResponseDto } from "../dto/response/get-blog-swagger-response.dto"
import { SearchBlogsSwaggerResponseDto } from "../dto/response/search-blogs-swagger-response.dto"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { SearchBlogsByCategoryServiceEntryDto } from "src/blog/application/dto/params/search-blogs-by-category-service-entry.dto"
import { SearchMostPopularBlogsByCategoryApplicationService } from "src/blog/application/services/queries/search-most-popular-blogs-by-category.service"
import { OrmCategoryRepository } from "src/categories/infraesctructure/repositories/orm-repositories/orm-category-repository"
import { OrmTrainerRepository } from "src/trainer/infraestructure/repositories/orm-repositories/orm-trainer-repository"
import { OrmCategoryMapper } from "src/categories/infraesctructure/mappers/orm-mappers/orm-category-mapper"
import { SearchRecentBlogsByCategoryApplicationService } from "src/blog/application/services/queries/search-recent-blogs-by-category.service"
import { SearchBlogsByTrainerServiceEntryDto } from "src/blog/application/dto/params/search-blogs-by-trainer-service-entry.dto"
import { SearchMostPopularBlogsByTrainerApplicationService } from "src/blog/application/services/queries/search-most-popular-blogs-by-trainer.service"
import { SearchRecentBlogsByTrainerApplicationService } from "src/blog/application/services/queries/search-recent-blogs-by-trainer.service"
import { SearchBlogQueryParametersDto } from "../dto/queryParameters/search-blog-query-parameters.dto"
import { CreateBlogEntryDto } from "../dto/entry/create-blog-entry.dto"
import { CreateBlogApplicationService } from "src/blog/application/services/commands/create-blog-application.service"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { AuditingDecorator } from "src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator"
import { FileExtender } from "src/common/Infraestructure/interceptors/file-extender"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { AzureFileUploader } from "src/common/Infraestructure/azure-file-uploader/azure-file-uploader"
import { Result } from "src/common/Domain/result-handler/Result"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { EventBus } from "src/common/Infraestructure/event-bus/event-bus"

@ApiTags( 'Blog' )
@Controller( 'blog' )
export class BlogController
{

    private readonly blogRepository: OrmBlogRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly categoryRepository: OrmCategoryRepository
    private readonly trainerRepository: OrmTrainerRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: AzureFileUploader
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.blogRepository =
            new OrmBlogRepository(
                new OrmBlogMapper(
                    new OrmTrainerMapper()
                ),
                new OrmBlogCommentMapper(),
                dataSource
            )
        this.auditingRepository = new OrmAuditingRepository( dataSource )

        this.categoryRepository = new OrmCategoryRepository(
            new OrmCategoryMapper(),
            dataSource )

        this.trainerRepository = new OrmTrainerRepository(
            new OrmTrainerMapper(),
            dataSource
        )
        this.idGenerator = new UuidGenerator()
        this.fileUploader = new AzureFileUploader()
    }


    @Post( 'create' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Crea un blog', type: GetBlogSwaggerResponseDto } )
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
    async createBlog (@UploadedFiles() images: Express.Multer.File[] ,@GetUser() user: User, @Body() createBlogParams: CreateBlogEntryDto )
    {
        const eventBus = EventBus.getInstance();
        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new LoggingDecorator(
                        new CreateBlogApplicationService(
                            this.blogRepository,
                            this.idGenerator,
                            this.trainerRepository,
                            this.categoryRepository,
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
        const result = await service.execute( { images: newImages, ...createBlogParams, userId: user.Id } )
        return result.Value
    }


    @Get( 'one/:id' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de un blog dado el id', type: GetBlogSwaggerResponseDto } )
    async getBlog ( @Param( 'id', ParseUUIDPipe ) id: string, @GetUser() user: User )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetBlogApplicationService(
                        this.blogRepository,
                        this.categoryRepository,
                        this.trainerRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            )
        const result = await service.execute( { blogId: id, userId: user.Id } )
        return result.Value
    }

    @Get( 'many' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de los blogs', type: SearchBlogsSwaggerResponseDto, isArray: true } )
    async searchBlogs ( @GetUser() user: User, @Query() searchBlogParams: SearchBlogQueryParametersDto )
    {

        if ( ( searchBlogParams.category || ( !searchBlogParams.category && !searchBlogParams.trainer ) ) )
        {
            const searchBlogServiceEntry: SearchBlogsByCategoryServiceEntryDto = { categoryId: searchBlogParams.category, userId: user.Id, pagination: { page: searchBlogParams.page, perPage: searchBlogParams.perPage } }

            if ( searchBlogParams.filter == 'POPULAR' )
            {
                const service =
                    new ExceptionDecorator(
                        new LoggingDecorator(
                            new SearchMostPopularBlogsByCategoryApplicationService(
                                this.blogRepository,
                                this.categoryRepository,
                                this.trainerRepository
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
                            new SearchRecentBlogsByCategoryApplicationService(
                                this.blogRepository,
                                this.categoryRepository,
                                this.trainerRepository
                            ),
                            new NativeLogger( this.logger )
                        ),
                        new HttpExceptionHandler()
                    )
                const result = await service.execute( searchBlogServiceEntry )

                return result.Value
            }

        }

        const searchBlogServiceEntry: SearchBlogsByTrainerServiceEntryDto = { trainerId: searchBlogParams.trainer, userId: user.Id, pagination: { page: searchBlogParams.page, perPage: searchBlogParams.perPage } }

        if ( searchBlogParams.filter == 'POPULAR' )
        {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchMostPopularBlogsByTrainerApplicationService(
                            this.blogRepository,
                            this.categoryRepository,
                            this.trainerRepository
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
                        new SearchRecentBlogsByTrainerApplicationService(
                            this.blogRepository,
                            this.categoryRepository,
                            this.trainerRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( searchBlogServiceEntry )

            return result.Value
        }


    }

}