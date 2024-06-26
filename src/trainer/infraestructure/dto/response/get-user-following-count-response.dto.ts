import { ApiProperty } from "@nestjs/swagger";

export class GetUserFollowingCountSwaggerResponseDto
{
    @ApiProperty
    ({
        example: 21, type:Number
    })
    count: number
}