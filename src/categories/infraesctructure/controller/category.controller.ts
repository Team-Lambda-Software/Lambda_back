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
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"
import { PaginationDto } from '../../../common/Infraestructure/dto/entry/pagination.dto';
import { GetAllCategoriesApplicationService } from "src/categories/application/service/queries/get-all-category-application.service"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"

@ApiTags( 'Category' )
@Controller( 'category' )
export class CategoryController
{

    private readonly categoryRepository: OrmCategoryRepository
    private readonly logger: Logger = new Logger( "CategorieController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.categoryRepository =
            new OrmCategoryRepository(
                new OrmCategoryMapper(),
                dataSource
            )

    }
    @Get('many')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @ApiOkResponse( { description: 'obtener todas las categorias',type: GetCategorieSwaggerResponseDto, isArray: true } )
    async getAllCategories ( @GetUser() user: User, @Query() pagination: PaginationDto)
    {
        const getAllCategoriesService = 
        new ExceptionDecorator( 
            new LoggingDecorator( 
                new GetAllCategoriesApplicationService( 
                    this.categoryRepository 
                ), 
                new NativeLogger( this.logger ) 
            ),
            new HttpExceptionHandler() 
        )
        return ( await getAllCategoriesService.execute( { userId: user.Id , pagination} ) ).Value
    }



}