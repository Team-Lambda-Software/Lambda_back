/* eslint-disable prettier/prettier */
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class FindUserByIdEntryDTO implements ApplicationServiceEntryDto{
    userId: string;
    
}