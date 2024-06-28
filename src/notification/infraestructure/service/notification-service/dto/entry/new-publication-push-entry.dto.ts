import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class NewPublicationPushDto implements ApplicationServiceEntryDto {
    userId: string
    publicationName: string
    trainerId: string
    publicationType: string
}