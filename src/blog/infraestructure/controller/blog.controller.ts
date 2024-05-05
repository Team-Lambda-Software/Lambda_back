import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { DataSource } from "typeorm"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { OrmBlogRepository } from "../repositories/orm-repositories/orm-blog-repository"
import { OrmBlogMapper } from "../mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogCommentMapper } from "../mappers/orm-mappers/orm-blog-comment-mapper"
import { GetBlogApplicationService } from "src/blog/application/services/queries/get-blog-application.service"
import { SearchBlogEntryDto } from "../dto/entry/search-blog-entry.dto"
import { SearchBlogByTitleEntryDto } from "src/blog/application/dto/params/search-blog-by-title-entry.dto"
import { SearchBlogByTitleApplicationService } from "src/blog/application/services/queries/search-blog-by-title-application.service"
import { SearchBlogByCategoryEntryDto } from "src/blog/application/dto/params/search-blog-by-category-entry.dto"
import { SearchBlogByCategoryApplicationService } from "src/blog/application/services/queries/search-blog-by-category-application.service"
import { AddCommentToBlogEntryDto } from "../dto/entry/add-comment-to-blog-entry.dto"
import { AddCommentToBlogApplicationService } from "src/blog/application/services/commands/add-comment-to-blog-application.service"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { GetBlogSwaggerResponseDto } from "../dto/response/get-blog-swagger-response.dto"
import { SearchBlogsSwaggerResponseDto } from "../dto/response/search-blogs-swagger-response.dto"
import { AddCommentToBlogSwaggerResponseDto } from "../dto/response/add-comment-to-blog-swagger-response.dto"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { AuditingDecorator } from "src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"

@ApiTags( 'Blog' )
@Controller( 'blog' )
export class BlogController
{

    private readonly blogRepository: OrmBlogRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.idGenerator = new UuidGenerator()
        this.blogRepository =
            new OrmBlogRepository(
                new OrmBlogMapper(),
                new OrmBlogCommentMapper(),
                dataSource
            )
        this.auditingRepository = new OrmAuditingRepository( dataSource )

    }

    @Get( ':id' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de un blog dado el id', type: GetBlogSwaggerResponseDto } )
    async getBlog ( @Param( 'id', ParseUUIDPipe ) id: string, @Query() commentPagination: PaginationDto, @GetUser() user: User)
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetBlogApplicationService(
                        this.blogRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( { blogId: id, userId: user.Id, commentPagination} )
        return result.Value
    }

    @Post( 'search' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve los blogs que tengan el nombre dado', type: SearchBlogsSwaggerResponseDto, isArray: true } )
    async searchBlog ( @Body() searchBlogEntryDto: SearchBlogEntryDto, @Query() pagination: PaginationDto, @GetUser() user: User )
    {
        const searchBlogServiceEntry: SearchBlogByTitleEntryDto = { ...searchBlogEntryDto, userId: user.Id, pagination }
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchBlogByTitleApplicationService(
                        this.blogRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchBlogServiceEntry )

        return result.Value
    }

    @Get( 'category/:categoryId' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve los blogs que tengan el nombre dado', type: SearchBlogsSwaggerResponseDto, isArray: true } )
    async searchCourseByCategory ( @Param( 'categoryId', ParseUUIDPipe ) categoryId: string, @Query() pagination: PaginationDto, @GetUser() user: User)
    {
        const searchBlogByCategoryServiceEntry: SearchBlogByCategoryEntryDto = { categoryId, userId: user.Id, pagination}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchBlogByCategoryApplicationService(
                        this.blogRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchBlogByCategoryServiceEntry )

        return result.Value
    }

    @Post( ':blogId/comment' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Agrega un comentario a un blog', type: AddCommentToBlogSwaggerResponseDto } )
    async addCommentToSection ( @Param( 'blogId', ParseUUIDPipe ) blogId: string, @Body() comment: AddCommentToBlogEntryDto, @GetUser() user: User)
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
                )
            )

        const data = { ...comment, blogId, userId: user.Id }
        const result = await service.execute( data )
        return result.Value
    }


}