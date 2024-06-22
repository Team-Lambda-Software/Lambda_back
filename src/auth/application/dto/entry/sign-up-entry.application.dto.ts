import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class SignUpEntryDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
    password: string  
    name: string
    type: string
    phone: string
}