/* eslint-disable prettier/prettier */
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"

export interface UpdateUserProfileInfraServiceResponseDto extends ApplicationServiceEntryDto {

    userId: string,
}