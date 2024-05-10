import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID} from "class-validator";
import { ProgressVideo } from "src/progress/domain/entities/progress-video";

export class SaveSectionProgressEntryDto
{
    @ApiProperty({ type: String, example:'a94d9eb1-efab-43a3-97d6-31f1236b198b', description: "Id del video"})
    @IsUUID() //to-do check that it is UUIDv4
    sectionId: string;

    @ApiProperty( {
        example: false, type:Boolean
    } )
    @IsOptional()
    @IsBoolean()
    isCompleted?:boolean;

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
    @IsOptional()
    videos?:Map<string, {userId:string, videoId:string, playbackMilisec:number, isCompleted:boolean}>; //? Does not work with Map<string,ProgressVideo>, why? (Getters will return undefined)
}