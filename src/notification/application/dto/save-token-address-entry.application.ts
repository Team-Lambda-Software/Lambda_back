import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class SaveTokenAddressEntryApplicationDto implements ApplicationServiceEntryDto {
    userId: string
    token: string
}