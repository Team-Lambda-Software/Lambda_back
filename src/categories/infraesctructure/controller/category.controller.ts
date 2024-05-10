import { DataSource } from "typeorm"
import { OrmCategoryMapper } from "../mappers/orm-mappers/orm-category-mapper"
import { OrmCategoryRepository } from "../repositories/orm-repositories/orm-category-repository"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { Controller, Get, Inject, Logger, Param, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetCategorieSwaggerResponseDto } from "../dto/response/get-categorie-swagger-response.dto"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { GetCategoryApplicationService } from "src/categories/application/service/queries/get-category-application.service"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"
import { PaginationDto } from '../../../common/Infraestructure/dto/entry/pagination.dto'
import { SearchContentByCategoryApplicationService } from "src/categories/application/service/queries/search-content-by-category.service"
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository"
import { OrmBlogRepository } from "src/blog/infraestructure/repositories/orm-repositories/orm-blog-repository"
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper"
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper"
import { OrmBlogMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogCommentMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-comment-mapper"
import { GetAllCategoriesApplicationService } from "src/categories/application/service/queries/get-all-category-application.service"
import { SearchContentByCategorySwaggerResponseDto } from "../dto/response/search-content-by-category-swagger-response.dto"

@ApiTags( 'Category' )
@Controller( 'category' )
export class CategoryController
{

    private readonly categoryRepository: OrmCategoryRepository
    private readonly courseRepository: OrmCourseRepository
    private readonly blogRepository: OrmBlogRepository
    private readonly logger: Logger = new Logger( "CategorieController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.categoryRepository =
            new OrmCategoryRepository(
                new OrmCategoryMapper(),
                dataSource
            )

        this.courseRepository = new OrmCourseRepository(
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

    }

    @Get( ':id' )
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @ApiOkResponse( { description: 'Obtener una categoria dado el id' ,type: GetCategorieSwaggerResponseDto } )
    async getCategory ( @Param( 'id' ) id: string, @GetUser() user: User )
    {

        const getCategoryService = new ExceptionDecorator( new LoggingDecorator( new GetCategoryApplicationService( this.categoryRepository ), new NativeLogger( this.logger ) ) )
        return ( await getCategoryService.execute( { categoryId: id, userId: user.Id } ) ).Value

    }

    @Get( 'searchContent/:categoryId' )
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @ApiOkResponse( { description: 'buscar todas los cursos y blogs de una categoria',type: SearchContentByCategorySwaggerResponseDto } )
    async searchContentByCategory ( @Param( 'categoryId' ) categoryId: string, @GetUser() user: User,@Query() pagination: PaginationDto )
    {

        const searchContentByCategoryService = new ExceptionDecorator( new LoggingDecorator( new SearchContentByCategoryApplicationService(this.courseRepository, this.blogRepository), new NativeLogger( this.logger ) ) )
        return ( await searchContentByCategoryService.execute( { categoryId: categoryId, userId: user.Id, pagination} ) ).Value

    }

    @Get()
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @ApiOkResponse( { description: 'obtener todas las categorias',type: GetCategorieSwaggerResponseDto, isArray: true } )
    async getAllCategories ( @GetUser() user: User )
    {
        const getAllCategoriesService = new ExceptionDecorator( new LoggingDecorator( new GetAllCategoriesApplicationService( this.categoryRepository ), new NativeLogger( this.logger ) ) )
        return ( await getAllCategoriesService.execute( { userId: user.Id } ) ).Value
    }



}