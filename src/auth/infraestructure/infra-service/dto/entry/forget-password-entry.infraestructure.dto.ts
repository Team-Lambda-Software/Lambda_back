import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class ForgetPasswordEntryDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
}