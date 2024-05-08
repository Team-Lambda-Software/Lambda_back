import { ApiProperty } from "@nestjs/swagger"
import { Blog } from "src/blog/domain/blog"
import { Course } from "src/course/domain/course"



export class SearchContentByCategorySwaggerResponseDto {

    @ApiProperty({
        example: [
            {
              "id": "c380d1b4-edb3-4fd9-9304-5c0c39452464",
              "trainer": {
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
              },
              "name": "Curso Yoga 1",
              "description": "Este es un curo de yoga que va a volarte la cabeza",
              "weeksDuration": 15,
              "minutesPerSection": 25,
              "level": 1,
              "sections": [
                {
                  "id": "d1381133-a423-475a-9947-eefd3cfdb1bd",
                  "name": "seccion 1",
                  "description": "primera seccion de este tremendo curso",
                  "videos": [],
                  "images": [],
                  "paragraph": "En el corazón del frenesí moderno, el yoga emerge como un oasis de paz y armonía. Una práctica milenaria que invita a conectar con nuestro cuerpo, mente y espíritu, trascendiendo las limitaciones físicas y explorando las infinitas posibilidades que residen en nuestro interior.\n\nMás allá de simples posturas o ejercicios físicos, el yoga se presenta como un viaje de autodescubrimiento. Un camino que nos guía hacia la consciencia plena, permitiéndonos observar nuestros pensamientos y emociones sin juicio, abrazando la quietud y la serenidad que habitan en nuestro ser."
                }
              ],
              "categoryId": "f8caeedb-6bb8-44bf-bdde-04a532bbf261",
              "image": {
                "url": "96954cbd-c90d-4458-b354-b3c26957e69d",
                "id": "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/yoga-en-casa-principiantes_471fbed4_231129144856_1280x800.jpg"
              }
            },],
    })
    courses: Course[]

    @ApiProperty({
        example: [
            {
              "id": "a5e67542-6acf-4fdc-8897-84e9da754c51",
              "title": "el blog de prueba numero 1",
              "body": "hola que tallll",
              "images": [
                {
                  "url": "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/16300683348682.jpg",
                  "id": "a5e67542-6acf-4fdc-8897-84e9da754c51"
                }
              ],
              "publicationDate": "2024-05-05T04:00:00.000Z",
              "trainer": {
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
              },
              "categoryId": "f8caeedb-6bb8-44bf-bdde-04a532bbf261"
            }
          ]
    })
    blogs: Blog[]

}