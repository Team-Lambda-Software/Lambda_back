/* eslint-disable prettier/prettier */
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class FollowUnfollowEntryDtoService implements ApplicationServiceEntryDto{
    userId: string;
    trainerId: string;
}