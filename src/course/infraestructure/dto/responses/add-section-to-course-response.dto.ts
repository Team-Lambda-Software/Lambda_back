import { ApiProperty } from "@nestjs/swagger"


export class AddSectionToCourseResponseDto
{
    @ApiProperty({
        example: "c2c7b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b",
    })
    id: string

    @ApiProperty({
        example: "Section name",
    })
    name: string

    @ApiProperty({
        example: "Section description",
    })
    description: string

    @ApiProperty({
        example: "https://www.youtube.com/watch?v=video",
    })
    video: string

    @ApiProperty({
        example: 30,
    })
    duration: number
    
}