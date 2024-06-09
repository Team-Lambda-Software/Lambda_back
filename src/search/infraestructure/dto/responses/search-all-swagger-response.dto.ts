import { ApiProperty } from "@nestjs/swagger"
import { Blog } from "src/blog/domain/blog"
import { Course } from "src/course/domain/course"




export class SearchAllSwaggerResponseDto
{

    @ApiProperty( {
        example: [ {
            "id": "e4b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
            "title": "Blog de programación",
            "image": "https://www.google.com",
            "date": "2024-05-20T17:23:23.854Z",
            "category": "yoga",
            "trainer": "pedro pascal perez"
        } ],
    } )
    blogs: Blog[]

    @ApiProperty( {
        example: [ {
            "id": "e4b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
            "title": "Curso de programación",
            "image": "https://www.google.com",
            "date": "2024-05-20T17:23:23.834Z",
            "category": "yoga",
            "trainer": "pedro pascal perez"
        } ],
    } )
    courses: Course[]

}