import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export interface SyncProgressCourseEntryDto extends ApplicationServiceEntryDto
{
    userId: string;
    courseId: string;
}