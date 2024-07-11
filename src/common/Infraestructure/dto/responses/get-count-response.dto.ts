import { ApiProperty } from "@nestjs/swagger"



export class GetCountResponseDto
{
    @ApiProperty({
        example: 1
    })
    count: number
}