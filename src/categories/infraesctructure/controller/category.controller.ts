import { DataSource } from "typeorm"
import { OrmCategoryMapper } from "../mappers/orm-mappers/orm-category-mapper"
import { OrmCategoryRepository } from "../repositories/orm-repositories/orm-category-repository"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Get, Inject, Logger, Param, Post, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetCategorieSwaggerResponseDto } from "../dto/response/get-categorie-swagger-response.dto"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"
import { PaginationDto } from '../../../common/Infraestructure/dto/entry/pagination.dto';
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { CreateCategoryEntryDto } from "../dto/entry/create-category-entry.dto"
import { OdmCategoryRepository } from "../repositories/odm-repositories/odm-category-repository"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { OdmCategoryEntity } from "../entities/odm-entities/odm-category.entity"
import { Category } from "src/categories/domain/categories"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { CategoryName } from "src/categories/domain/value-objects/category-title"
import { CategoryIcon } from "src/categories/domain/value-objects/category-image"
import { GetAllCategoriesService } from "../query-services/services/get-all-category.service"

@ApiTags( 'Category' )
@Controller( 'category' )
export class CategoryController
{

    private readonly categoryRepository: OrmCategoryRepository
    private readonly odmCategoryRepository: OdmCategoryRepository
    private readonly logger: Logger = new Logger( "CategorieController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource, @InjectModel('Category') private categoryModel: Model<OdmCategoryEntity> )
    {
        this.categoryRepository =
            new OrmCategoryRepository(
                new OrmCategoryMapper(),
                dataSource
            )
        this.odmCategoryRepository = new OdmCategoryRepository(
            categoryModel
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
                new GetAllCategoriesService( 
                    this.odmCategoryRepository
                ), 
                new NativeLogger( this.logger ) 
            ),
            new HttpExceptionHandler() 
        )
        return ( await getAllCategoriesService.execute( { userId: user.Id , pagination} ) ).Value
    }



}