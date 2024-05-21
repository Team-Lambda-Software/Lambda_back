import { ApiProperty } from "@nestjs/swagger"




export class SearchBlogsSwaggerResponseDto
{

    
    @ApiProperty({
        example: "e4b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
    })
    id: string

    @ApiProperty({
        example: "Blog de programación",
    })
    title: string

    @ApiProperty({
        example: "https://www.google.com",
    })
    image: string
    
    @ApiProperty({
        example: new Date(),
    })
    date: Date

    @ApiProperty({
        example: "yoga",
    })
    category: string

    @ApiProperty({
        example: "pedro pascal perez",
    })
    trainer: string


}