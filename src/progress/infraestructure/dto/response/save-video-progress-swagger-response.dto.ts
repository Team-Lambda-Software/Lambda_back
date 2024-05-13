import { ApiProperty } from "@nestjs/swagger";

export class SaveVideoProgressSwaggerResponseDto
{
    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
    } )
    userId: string;

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
    } )
    videoId: string;

    @ApiProperty( {
        example: 2111,
    } )
    playbackMilisec: number;

    @ApiProperty( {
        example: false,
    } )
    isCompleted:boolean;
}