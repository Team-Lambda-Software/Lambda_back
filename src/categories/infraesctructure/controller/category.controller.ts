import { DataSource} from "typeorm"
import { OrmCategoryMapper } from "../mappers/orm-mappers/orm-category-mapper"
import { OrmCategoryRepository } from "../repositories/orm-repositories/orm-category-repository"
import { OrmAuditingRepository } from "src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Get, Inject, Logger, Param, Patch, UseGuards} from "@nestjs/common"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetCategorieSwaggerResponseDto } from "../dto/response/get-categorie-swagger-response.dto"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { GetCategoryApplicationService } from "src/categories/application/service/get-category-application.service"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"

@ApiTags( 'Category' )
@Controller( 'category' )
export class CategoryController
{

    private readonly categoryRepository: OrmCategoryRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly logger: Logger = new Logger( "CategorieController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.categoryRepository =
            new OrmCategoryRepository(
                new OrmCategoryMapper(),
                dataSource
            )
        this.auditingRepository = new OrmAuditingRepository( dataSource )

    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @ApiOkResponse( { type: GetCategorieSwaggerResponseDto } )
    async getCategory(@Param('id') id: string, @GetUser() user: User) {
        
        const getCategorieProfileService = new ExceptionDecorator(new LoggingDecorator(new GetCategoryApplicationService(this.categoryRepository), new NativeLogger(this.logger)))
        return (await getCategorieProfileService.execute({categoryId : id, userId: user.Id})).Value
        
    }




}