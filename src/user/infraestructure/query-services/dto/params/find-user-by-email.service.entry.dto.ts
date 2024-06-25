/* eslint-disable prettier/prettier */
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export interface FindUserByEmailEntryDTO extends ApplicationServiceEntryDto{
    email: string
}