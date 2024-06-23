import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class GetNotificationUserEntryAplicationDto implements ApplicationServiceEntryDto {
    userId: string;
    notificationId:string
}