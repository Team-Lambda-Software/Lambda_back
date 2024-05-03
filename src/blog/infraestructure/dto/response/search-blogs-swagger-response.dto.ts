import { ApiProperty } from "@nestjs/swagger"
import { BlogImage } from "src/blog/domain/entities/blog-image"




export class SearchBlogsSwaggerResponseDto
{

    @ApiProperty({
        example: "c998936e-2386-4a9d-a3a2-9f717694b3e9"
    })
    id: string

    @ApiProperty({
        example: "Blog 1"
    })
    title: string

    @ApiProperty({
        example: "asfsdgdsagdsgdsgzdfgdfg"
    })
    body: string

    @ApiProperty({
        example: {
            "url": "www.image.com",
            "id": "fb1ab873-9c04-4cbe-b77c-260fd0a26e70"
        }
    })
    image: BlogImage

    @ApiProperty({
        example: "2024-01-05T04:00:00.000Z"
    })
    publicationDate: Date

    @ApiProperty({
        example: "25e39f38-2893-4b95-9b84-6fbab002dc94"
    })
    trainerId: string

    @ApiProperty({
        example: "b12702a2-55cd-4955-97b8-992048dfd499"
    })
    categoryId: string
    
}