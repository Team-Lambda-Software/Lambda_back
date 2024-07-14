import { ApplicationServiceEntryDto } from 'src/common/Application/application-services/dto/application-service-entry.dto';

export interface CreateTrainerServiceEntryDto
  extends ApplicationServiceEntryDto {
  firstName: string;
  firstLastName: string;
  secondLastName: string;
  email: string;
  phone: string;
}
