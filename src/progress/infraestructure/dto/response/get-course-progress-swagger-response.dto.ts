import { ApiProperty } from "@nestjs/swagger";

export class GetCourseProgressSwaggerResponseDto
{
    @ApiProperty({
        example: 21, type:Number
    })
    percent:number;

    @ApiProperty({
        example: [{
            lessonId: "d1381133-a423-475a-9947-eefd3cfdb1bd",
            time: 21,
            percent: 11
        }],
        isArray: true
    })
    lessons: Array<{lessonId:string, time?:number, percent:number}>;
}