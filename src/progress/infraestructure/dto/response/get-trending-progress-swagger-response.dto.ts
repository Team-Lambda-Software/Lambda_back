import { ApiProperty } from "@nestjs/swagger";

export class GetTrendingCourseSwaggerResponseDto
{
    @ApiProperty({
        example: 21, type:Number
    })
    percent: number;

    @ApiProperty({ type: String, example:'Yoga para Principiantes I'})
    courseTitle: string;

    @ApiProperty({ type: String, example:'a94d9eb1-efab-43a3-97d6-31f1236b198b'})
    courseId: string;

    @ApiProperty({ type: Date, example: new Date() })
    lastTime: Date
}