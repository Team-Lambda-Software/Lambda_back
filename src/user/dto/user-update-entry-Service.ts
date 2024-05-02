/* eslint-disable prettier/prettier */
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class userUpdateEntryDtoService implements ApplicationServiceEntryDto{
    
    userId: string;
    firstName?: string;
    firstLastName?: string;
    secondLastName?: string;
    email? :string; 
    password?: string;
    phone?: string;

}