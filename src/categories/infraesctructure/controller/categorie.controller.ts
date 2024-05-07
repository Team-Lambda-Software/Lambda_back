import { DataSource} from "typeorm"
import { OrmCategorieMapper } from "../mappers/orm-mappers/orm-categorie-mapper"
import { OrmCategorieRepository } from "../repositories/orm-repositories/orm-categorie-repository"
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
import { GetCategorieApplicationService } from "src/categories/application/Dto/get-categorie-application.service"

@ApiTags( 'Categorie' )
@Controller( 'categorie' )
export class CategorieController
{

    private readonly categorieRepository: OrmCategorieRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly logger: Logger = new Logger( "CategorieController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.idGenerator = new UuidGenerator()
        this.categorieRepository =
            new OrmCategorieRepository(
                new OrmCategorieMapper(),
                dataSource
            )
        this.auditingRepository = new OrmAuditingRepository( dataSource )

    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        
        const getCategorieProfileService = new ExceptionDecorator(new LoggingDecorator(new GetCategorieApplicationService(this.categorieRepository), new NativeLogger(this.logger)))
        return (await getCategorieProfileService.execute({categoryId : id})).Value
        
    }




}