import { ApiProperty } from "@nestjs/swagger"
import { Course } from "src/course/domain/course"
import { SectionImage } from "src/course/domain/entities/compose-fields/section-image"
import { Section } from "src/course/domain/entities/section"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"
import { ProgressSection } from "src/progress/domain/entities/progress-section"
import { Trainer } from "src/trainer/domain/trainer"




export class GetCourseSwaggerResponseDto
{

    // @ApiProperty( {
    //     example: {
    //         "id": "c380d1b4-edb3-4fd9-9304-5c0c39452464",
    //         "trainer": {
    //           "id": "8fe7e9dc-c594-4d27-8502-b7bd18d5a72f",
    //           "firstName": "Jose",
    //           "firstLastName": "Fernandez",
    //           "secondLastName": "Estrada",
    //           "email": "fer@gmail.com",
    //           "phone": "04125687493",
    //           "followersID": [],
    //           "coursesID": [],
    //           "blogsID": [],
    //           "location": "99 Park Ave, New York, NY 10016, EE. UU."
    //         },
    //         "name": "Curso Yoga 1",
    //         "description": "Este es un curo de yoga que va a volarte la cabeza",
    //         "weeksDuration": 15,
    //         "minutesPerSection": 25,
    //         "level": 1,
    //         "sections": [
    //           {
    //             "id": "d1381133-a423-475a-9947-eefd3cfdb1bd",
    //             "name": "seccion 1",
    //             "description": "primera seccion de este tremendo curso",
    //             "video": 
    //               {
    //                 "url": "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/170246-843069659_small.mp4",
    //                 "id": "96c87e47-6e42-4a32-9788-1c4f7342f4fc"
    //               }
    //             ,
    //             "image": 
    //               {
    //                 "url": "2b081d53-e64f-4262-8a48-ad4152f38f70",
    //                 "id": "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/16300683348682.jpg"
    //               }
    //             ,
    //             "paragraph": "En el corazón del frenesí moderno, el yoga emerge como un oasis de paz y armonía. Una práctica milenaria que invita a conectar con nuestro cuerpo, mente y espíritu, trascendiendo las perPageaciones físicas y explorando las infinitas posibilidades que residen en nuestro interior.\n\nMás allá de simples posturas o ejercicios físicos, el yoga se presenta como un viaje de autodescubrimiento. Un camino que nos guía hacia la consciencia plena, permitiéndonos observar nuestros pensamientos y emociones sin juicio, abrazando la quietud y la serenidad que habitan en nuestro ser."
    //           }
    //         ],
    //         "categoryId": "f8caeedb-6bb8-44bf-bdde-04a532bbf261",
    //         "image": {
    //           "url": "96954cbd-c90d-4458-b354-b3c26957e69d",
    //           "id": "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/yoga-en-casa-principiantes_471fbed4_231129144856_1280x800.jpg"
    //         },
    //         "tags": [
    //           "yoga",
    //           "men"
    //         ]
    //       },
    // } )
    // course: Course

    // @ApiProperty( {
    //     example: {
    //         "progress": {
    //           "sections": {},
    //           "userId": "e0f943f5-1327-45e1-a4f9-100c925486f0",
    //           "courseId": "c380d1b4-edb3-4fd9-9304-5c0c39452464",
    //           "isCompleted": false
    //         },
    //         "completionPercent": 0
    //       }
    // } )
    // courseProgress: ProgressCourse

    // @ApiProperty( {
    //     example: [{
    //       "progress":{
    //           "videos": {},
    //           "userId": "e0f943f5-1327-45e1-a4f9-100c925486f0",
    //           "sectionId": "d1381133-a423-475a-9947-eefd3cfdb1bd",
    //           "isCompleted": true
    //         },
    //         "completionPercent": 0
    //       }
    //       ],
    // } )
    // sectionProgress: ProgressSection

    @ApiProperty( {
        example: "El gran atraco"
    } )
    title: string

    @ApiProperty( {
        example: "Descripcion del curso"
    } )
    description: string

    @ApiProperty( {
        example: "e0f943f5-1327-45e1-a4f9-100c925486f0"
    } )
    category: string

    @ApiProperty( {
        example: "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/170246-843069659_small.mp4"
    } )
    image: string

    @ApiProperty( {
        example: {
            "Id": "8fe7e9dc-c594-4d27-8502-b7bd18d5a72f",
            "Name": "Jose Fernandez Estrada"
        }
    } )
    trainer: {
        Id: string
        Name: string
    }

    @ApiProperty( {
        example: "1"
    } )
    level: string

    @ApiProperty( {
        example: 15
    } )
    durationWeeks: number

    @ApiProperty( {
        example: 1000
    } )
    durationMinutes: number

    @ApiProperty( {
        example: ["yoga", "men"]
      })
    tags: string[]

    @ApiProperty( {
        example: new Date()
    } )
    date: Date

    @ApiProperty({
      example: [{
        id: "d1381133-a423-475a-9947-eefd3cfdb1bd",
        title: "seccion 1",
        content: "En el corazón del frenesí moderno, el yoga emerge como un oasis de paz y armonía.\n\n",
        video: "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/170246-843069659_small.mp4",
        image: "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/16300683348682.jpg"
      }]
    })
    lessons: {
        id: string
        title: string
        content: string
        video?: string
        image?: string
    }[]

}