import { ApplicationServiceEntryDto } from 'src/common/Application/application-services/dto/application-service-entry.dto';

export interface CreateCategoryServiceEntryDto
  extends ApplicationServiceEntryDto {
  name: string;
  icon: File;
}
