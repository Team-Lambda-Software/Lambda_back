import { DataSource } from 'typeorm';
import { NativeLogger } from 'src/common/Infraestructure/logger/logger';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/decorator/jwt-auth.guard';
import { GetCategorieSwaggerResponseDto } from '../dto/response/get-categorie-swagger-response.dto';
import { ExceptionDecorator } from 'src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator';
import { LoggingDecorator } from 'src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator';
import { GetUser } from 'src/auth/infraestructure/jwt/decorator/get-user.param.decorator';
import { PaginationDto } from '../../../common/Infraestructure/dto/entry/pagination.dto';
import { HttpExceptionHandler } from 'src/common/Infraestructure/http-exception-handler/http-exception-handler';
import { OdmCategoryRepository } from '../repositories/odm-repositories/odm-category-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OdmCategoryEntity } from '../entities/odm-entities/odm-category.entity';
import { GetAllCategoriesService } from '../query-services/services/get-all-category.service';
import { PerformanceDecorator } from 'src/common/Application/application-services/decorators/decorators/performance-decorator/performance.decorator';
import { OrmAuditingRepository } from 'src/common/Infraestructure/auditing/repositories/orm-repositories/orm-auditing-repository';
import { RabbitEventBus } from 'src/common/Infraestructure/rabbit-event-bus/rabbit-event-bus';
import { IEventHandler } from 'src/common/Application/event-handler/event-handler.interface';
import { CreateCategoryEntryDto } from '../dto/entry/create-category-entry.dto';
import { AuditingDecorator } from 'src/common/Application/application-services/decorators/decorators/auditing-decorator/auditing.decorator';
import { CreateCategoryApplicationService } from 'src/categories/application/service/command/create-category-application.service';
import { OrmCategoryRepository } from '../repositories/orm-repositories/orm-category-repository';
import { OrmCategoryMapper } from '../mappers/orm-mappers/orm-category-mapper';
import { UuidGenerator } from 'src/common/Infraestructure/id-generator/uuid-generator';
import { CategoryCreated } from 'src/categories/domain/events/category-created-event';
import { AzureFileUploader } from 'src/common/Infraestructure/azure-file-uploader/azure-file-uploader';
import { ImageTransformer } from 'src/common/Infraestructure/image-helper/image-transformer';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  private readonly odmCategoryRepository: OdmCategoryRepository;
  private readonly categoryRepository: OrmCategoryRepository;
  private readonly auditRepository: OrmAuditingRepository;
  private readonly eventBus: IEventHandler = RabbitEventBus.getInstance();
  private readonly idGenerator: UuidGenerator = new UuidGenerator();
  private readonly logger: Logger = new Logger('CategorieController');
  private readonly fileUploader: AzureFileUploader;
  private readonly imageTransformer: ImageTransformer;
  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
    @InjectModel('Category') private categoryModel: Model<OdmCategoryEntity>,
  ) {
    this.odmCategoryRepository = new OdmCategoryRepository(categoryModel);
    this.auditRepository = new OrmAuditingRepository(dataSource);

    this.categoryRepository = new OrmCategoryRepository(
      new OrmCategoryMapper(),
      dataSource,
    );
    this.fileUploader = new AzureFileUploader();
    this.imageTransformer = new ImageTransformer();
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'crear una categoria', type: String })
  async createCategory(@GetUser() user, @Body() data: CreateCategoryEntryDto) {
    const createCategoryService = new ExceptionDecorator(
      new LoggingDecorator(
        new AuditingDecorator(
          new PerformanceDecorator(
            new CreateCategoryApplicationService(
              this.categoryRepository,
              this.idGenerator,
              this.eventBus,
              this.fileUploader,
            ),
            new NativeLogger(this.logger),
          ),
          this.auditRepository,
          this.idGenerator,
        ),
        new NativeLogger(this.logger),
      ),
      new HttpExceptionHandler(),
    );

    let newImage: File;
    try {
      newImage = await this.imageTransformer.base64ToFile(data.icon);
    } catch (error) {
      throw new BadRequestException('Las imagenes deben ser en formato base64');
    }

    const result = await createCategoryService.execute({
      userId: user.id,
      icon: newImage,
      name: data.name,
    });
    this.eventBus.subscribe(
      'CategoryCreated',
      async (event: CategoryCreated) => {
        const category = await this.categoryModel.create({
          id: event.id,
          categoryName: event.name,
          icon: event.icon,
        });
        this.odmCategoryRepository.saveCategory(category);
      },
    );
  }

  @Get('many')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'obtener todas las categorias',
    type: GetCategorieSwaggerResponseDto,
    isArray: true,
  })
  async getAllCategories(@GetUser() user, @Query() pagination: PaginationDto) {
    const getAllCategoriesService = new ExceptionDecorator(
      new LoggingDecorator(
        new PerformanceDecorator(
          new GetAllCategoriesService(this.odmCategoryRepository),
          new NativeLogger(this.logger),
        ),
        new NativeLogger(this.logger),
      ),
      new HttpExceptionHandler(),
    );
    return (
      await getAllCategoriesService.execute({ userId: user.id, pagination })
    ).Value;
  }
}
