import { ApiProperty } from "@nestjs/swagger"




export class GetBlogSwaggerResponseDto
{

    @ApiProperty({
        example: "Blog de programación",
    })
    title: string

    @ApiProperty({
        example: "Blog de programación",
    })
    description: string

    @ApiProperty({
        example: "yoga",
    })
    category: string

    @ApiProperty({
        example: ["https://www.google.com", "https://www.google.com"],
    })
    images: string[]

    @ApiProperty({
        example: {
            id: "e4b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
            name: "pedro pascal perez",
        },
    })
    trainer: {
        id: string
        name: string
    }

    @ApiProperty({
        example: ["tag1", "tag2"],
    })
    tags: string[]

    @ApiProperty({
        example: new Date(),
    })
    date: Date

}