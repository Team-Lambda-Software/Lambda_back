import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export interface SaveCourseProgressServiceEntryDto extends ApplicationServiceEntryDto
{
    courseId: string;
    isCompleted?:boolean;
    sections?:Map<string, {userId:string, sectionId:string, isCompleted?:boolean, videos?:Map<string, {userId:string, videoId:string, playbackMilisec:number, isCompleted:boolean}>}>;
}