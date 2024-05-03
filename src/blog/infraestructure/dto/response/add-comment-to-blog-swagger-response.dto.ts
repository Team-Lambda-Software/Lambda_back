import { ApiProperty } from "@nestjs/swagger"
import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"




export class AddCommentToBlogSwaggerResponseDto
{

    @ApiProperty( {
        example: 'c998936e-2386-4a9d-a3a2-9f717694b3e9'
    } )
    id: string

    @ApiProperty( {
        example: 'r775423e-2386-4a9d-a3a2-9f717694b3e9'
    } )
    userId: string

    @ApiProperty( {
        example: 'asdas'
    } )
    text: string

    @ApiProperty( {
        example: '2024-05-02T01:37:28.413Z'
    } )
    date: Date

    @ApiProperty( {
        example: 'c998936e-2386-4a9d-a3a2-9f717694b3e9'
    } )
    blogId: string

}