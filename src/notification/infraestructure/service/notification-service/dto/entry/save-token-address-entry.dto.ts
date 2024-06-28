import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class SaveTokenAddressEntryDto implements ApplicationServiceEntryDto {
    userId: string
    token: string
}