import { ApiProperty } from "@nestjs/swagger";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { SaveSectionProgressSwaggerResponseDto } from "./save-section-progress-swagger-response.dto";

export class SaveCourseProgressSwaggerResponseDto
{
    @ApiProperty( {
        example: 'a94d9eb1-efab-43a3-97d6-31f1236b198b'
    } )
    userId:string;

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2'
    } )
    courseId:string;

    @ApiProperty( {
        example: false, type:Boolean
    } )
    isCompleted:boolean;

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
    sections:Map<string, ProgressSection>;
}