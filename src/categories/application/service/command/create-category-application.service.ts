import { IApplicationService } from 'src/common/Application/application-services/application-service.interface';
import { CreateCategoryServiceEntryDto } from '../../dto/create-category-service-entry.dto';
import { Result } from 'src/common/Domain/result-handler/Result';
import { ICategoryRepository } from 'src/categories/domain/repositories/category-repository.interface';
import { IdGenerator } from 'src/common/Application/Id-generator/id-generator.interface';
import { IEventHandler } from 'src/common/Application/event-handler/event-handler.interface';
import { Category } from 'src/categories/domain/categories';
import { CategoryId } from 'src/categories/domain/value-objects/category-id';
import { CategoryName } from 'src/categories/domain/value-objects/category-title';
import { CategoryIcon } from 'src/categories/domain/value-objects/category-image';
import { IFileUploader } from 'src/common/Application/file-uploader/file-uploader.interface';

export class CreateCategoryApplicationService
  implements IApplicationService<CreateCategoryServiceEntryDto, string>
{
  private readonly categoryRepository: ICategoryRepository;
  private readonly idGenerator: IdGenerator<string>;
  private readonly eventHandler: IEventHandler;
  private readonly fileUploader: IFileUploader;

  constructor(
    categoryRepository: ICategoryRepository,
    idGenerator: IdGenerator<string>,
    eventHandler: IEventHandler,
    fileUploader: IFileUploader,
  ) {
    this.categoryRepository = categoryRepository;
    this.idGenerator = idGenerator;
    this.eventHandler = eventHandler;
    this.fileUploader = fileUploader;
  }

  async execute(data: CreateCategoryServiceEntryDto): Promise<Result<string>> {
    const iconId = await this.idGenerator.generateId();
    console.log('iconId', iconId);
    const iconUrl = await this.fileUploader.UploadFile(data.icon, iconId);
    console.log('iconUrl', iconUrl);
    const category = Category.create(
      CategoryId.create(await this.idGenerator.generateId()),
      CategoryName.create(data.name),
      CategoryIcon.create(iconUrl),
    );

    const result = await this.categoryRepository.saveCategory(category);

    if (!result.isSuccess()) {
      return Result.fail<string>(
        result.Error,
        result.StatusCode,
        result.Message,
      );
    }
    await this.eventHandler.publish(category.pullEvents());
    return Result.success<string>('categoria guardada', 201);
  }
  get name(): string {
    return 'CreateCategoryApplicationService';
  }
}
