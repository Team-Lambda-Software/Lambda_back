import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export interface InitiateCourseProgressEntryDto extends ApplicationServiceEntryDto
{
    userId: string;
    courseId: string;
}