/* eslint-disable prettier/prettier */
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"

export interface UpdateUserProfileInfraServiceEntryDto extends ApplicationServiceEntryDto {

    userId: string;
    password?: string;
    image?: File

}