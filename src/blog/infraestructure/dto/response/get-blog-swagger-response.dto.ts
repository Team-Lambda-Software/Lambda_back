import { ApiProperty } from "@nestjs/swagger"
import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"




export class GetBlogSwaggerResponseDto
{

    @ApiProperty( {
        example: {
            "id": "c998936e-2386-4a9d-a3a2-9f717694b3e9",
            "title": "Blog 1",
            "body": "asfsdgdsagdsgdsgzdfgdfg",
            "image": {
                "url": "www.image.com",
                "id": "fb1ab873-9c04-4cbe-b77c-260fd0a26e70"
            },
            "publicationDate": "2024-01-05T04:00:00.000Z",
            "trainerId": "25e39f38-2893-4b95-9b84-6fbab002dc94",
            "categoryId": "b12702a2-55cd-4955-97b8-992048dfd499"
        },
    } )
    blog: Blog

    @ApiProperty( {
        example: [
            {
                "id": "5ef3390c-fa09-4116-b899-7c81fc42f363",
                "userId": "df0595a1-ba58-47c7-ace6-b3d734b27a66",
                "text": "asdas",
                "date": "2024-05-02T01:37:28.413Z",
                "blogId": "c998936e-2386-4a9d-a3a2-9f717694b3e9"
            } ],
    } )
    comments: BlogComment[]

}