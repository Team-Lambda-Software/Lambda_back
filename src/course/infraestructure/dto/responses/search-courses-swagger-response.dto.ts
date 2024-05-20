import { ApiProperty } from "@nestjs/swagger"




export class SearchCoursesSwaggerResponseDto
{

    @ApiProperty({
        example: "e4b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
    })
    id: string

    @ApiProperty({
        example: "Curso de programación",
    })
    title: string

    @ApiProperty({
        example: "https://www.google.com",
    })
    image: string
    
    @ApiProperty({
        example: Date.now(),
    })
    date: Date

    @ApiProperty({
        example: "e9b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
    })
    category: string

    @ApiProperty({
        example: "e9b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
    })
    trainer: string

}