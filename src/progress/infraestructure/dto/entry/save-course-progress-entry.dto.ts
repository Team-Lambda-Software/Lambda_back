import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID} from "class-validator";
import { ProgressSection } from "src/progress/domain/entities/progress-section";

export class SaveCourseProgressEntryDto
{
    @ApiProperty({ type: String, example:'a94d9eb1-efab-43a3-97d6-31f1236b198b', description: "Id del video"})
    @IsUUID() //to-do check that it is UUIDv4
    courseId: string;

    @ApiProperty( {
        example: false, type:Boolean
    } )
    @IsOptional()
    @IsBoolean()
    isCompleted?:boolean;

    @ApiProperty( {
        type: 'object', //Raw definition of Map<string, ProgressSection>
        additionalProperties: {
            type: 'SaveSectionProgressSwaggerResponseDto'
        },
        example: {
            "d1381133-a423-475a-9947-eefd3cfdb1bd": {
                "userId": "115ff3c8-3277-42f3-999c-c50e50064edc",
                "sectionId": "d1381133-a423-475a-9947-eefd3cfdb1bd",
                "isCompleted": false,
                "videos": {
                    'a1d0a0b6-3fcb-4600-acca-8b14474f94a8': { 
                        "userId": "a94d9eb1-efab-43a3-97d6-31f1236b198b",
                        "videoId": "a1d0a0b6-3fcb-4600-acca-8b14474f94a8",
                        "playbackMilisec": 2111,
                        "isCompleted": false
                    }
                }
            }
        }
    })
    @IsOptional()
    sections?:Map<string, {userId:string, sectionId:string, isCompleted?:boolean, videos?:Map<string, {userId:string, videoId:string, playbackMilisec:number, isCompleted:boolean}>}>; //? Does not work with Map<string,ProgressVideo>, why? (Getters will return undefined)
}