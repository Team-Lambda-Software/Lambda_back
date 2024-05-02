import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class SignUpEntryApplicationDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
    password: string  
    firstName: string
    firstLastName: string
    secondLastName: string  
}