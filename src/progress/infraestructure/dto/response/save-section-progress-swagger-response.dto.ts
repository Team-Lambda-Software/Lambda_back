import { ApiProperty } from "@nestjs/swagger";
import { ProgressVideo } from "src/progress/domain/entities/progress-video";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { SaveVideoProgressSwaggerResponseDto } from "./save-video-progress-swagger-response.dto";

export class SaveSectionProgressSwaggerResponseDto
{
    @ApiProperty( {
        example: 'a94d9eb1-efab-43a3-97d6-31f1236b198b', type:UUID
    } )
    userId:string;

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2', type:UUID
    } )
    sectionId:string;

    @ApiProperty( {
        example: false, type:Boolean
    } )
    isCompleted:boolean;

    @ApiProperty( {
        type: 'object', //Raw definition of Map<string, ProgressVideo>
        additionalProperties: {
            type: 'SaveVideoProgressSwaggerResponseDto'
        },
        example: {
            '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2': { 
                "userId": "a94d9eb1-efab-43a3-97d6-31f1236b198b",
                "videoId": "a1d0a0b6-3fcb-4600-acca-8b14474f94a8",
                "playbackMilisec": 2111,
                "isCompleted": false
            },
            'e6920932-a110-4a7a-b267-7c963b7a4891': {
                "userId": "a94d9eb1-efab-43a3-97d6-31f1236b198b",
                "videoId": "bb63e2cb-c677-4072-ab16-e9b4147d4ba6",
                "playbackMilisec": 2002,
                "isCompleted": true
            }
        }
    })
    videos:Map<string,ProgressVideo>;
}