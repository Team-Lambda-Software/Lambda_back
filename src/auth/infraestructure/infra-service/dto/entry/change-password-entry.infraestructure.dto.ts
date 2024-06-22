import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class ChangePasswordEntryDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
    password: string
    code: string
}