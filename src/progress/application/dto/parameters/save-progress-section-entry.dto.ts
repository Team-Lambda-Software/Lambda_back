import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { ProgressVideo } from "src/progress/domain/entities/progress-video";

export interface SaveSectionProgressServiceEntryDto extends ApplicationServiceEntryDto
{
    sectionId: string;
    isCompleted?:boolean;
    videos?:Map<string, {userId:string, videoId:string, playbackMilisec:number, isCompleted:boolean}>;
}