import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class SyncProgressCourseEntryDto implements ApplicationServiceEntryDto
{
    userId: string;
    courseId: string;
}