/* eslint-disable prettier/prettier */
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"

export interface UpdateUserProfileServiceEntryDto extends ApplicationServiceEntryDto {

    userId: string;
    name?: string;
    email? :string; 
    password?: string;
    phone?: string;
    image?: string

}