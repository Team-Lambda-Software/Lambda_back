import { ApiProperty } from "@nestjs/swagger"
import { BlogImage } from "src/blog/domain/entities/blog-image"
import { Trainer } from "src/trainer/domain/trainer"




export class SearchBlogsSwaggerResponseDto
{

    @ApiProperty( {
        example: "c998936e-2386-4a9d-a3a2-9f717694b3e9"
    } )
    id: string

    @ApiProperty( {
        example: "Blog 1"
    } )
    title: string

    @ApiProperty( {
        example: "asfsdgdsagdsgdsgzdfgdfg"
    } )
    body: string

    @ApiProperty( {
        example: [ {
            "url": "www.image.com",
            "id": "fb1ab873-9c04-4cbe-b77c-260fd0a26e70"
        } ]
    } )
    images: BlogImage[]

    @ApiProperty( {
        example: "2024-01-05T04:00:00.000Z"
    } )
    publicationDate: Date

    @ApiProperty( {
        example: {
            "id": "8fe7e9dc-c594-4d27-8502-b7bd18d5a72f",
            "firstName": "Jose",
            "firstLastName": "Fernandez",
            "secondLastName": "Estrada",
            "email": "fer@gmail.com",
            "phone": "04125687493",
            "followersID": [],
            "coursesID": [],
            "blogsID": [],
            "location": "99 Park Ave, New York, NY 10016, EE. UU."
        }
    } )
    trainer: Trainer

    @ApiProperty( {
        example: "b12702a2-55cd-4955-97b8-992048dfd499"
    } )
    categoryId: string

}