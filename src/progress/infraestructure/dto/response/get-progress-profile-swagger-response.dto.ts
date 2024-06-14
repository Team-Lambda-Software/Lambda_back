import { ApiProperty } from "@nestjs/swagger"

export class GetProgressProfileSwaggerResponseDto
{
    @ApiProperty({
        example: 21.11, type:Number
    })
    percent: number

    @ApiProperty({
        example: 20.02, type:Number
    })
    time: number
}