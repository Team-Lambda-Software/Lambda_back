import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export interface SaveSectionProgressServiceEntryDto extends ApplicationServiceEntryDto
{
    courseId: string;
    sectionId: string;
    userId:string;
    isCompleted:boolean;
    videoSecond?:number;
}