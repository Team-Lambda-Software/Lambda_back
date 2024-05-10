import { ApiProperty } from "@nestjs/swagger"
import { Course } from "src/course/domain/course"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"
import { User } from "src/user/domain/user"



export class GetUserSwaggerResponseDto {

    @ApiProperty({
        example: {
            "id": "e0f943f5-1327-45e1-a4f9-100c925486f0",
            "firstName": "Samuel",
            "firstLastName": "Alonso",
            "secondLastName": "Charris",
            "email": "sam@gmail.com",
            "password": "$2a$12$ppp.wL6fKswF2FqT/AgMn.2e7MSneJoOognXwpyLcRkVaQCifSpYO",
            "phone": "04242176479"
          }
    })
    user: User

    @ApiProperty({
        example:  [
            {
              "id": "c380d1b4-edb3-4fd9-9304-5c0c39452464",
              "trainer": {
                "id": "8fe7e9dc-c594-4d27-8502-b7bd18d5a72f",
                "firstName": "Jose",
                "firstLastName": "Fernandez",
                "secondLastName": "Estrada",
                "email": "fer@gmail.com",
                "phone": "04125687493",
                "followersID": [
                  "e0f943f5-1327-45e1-a4f9-100c925486f0"
                ],
                "coursesID": [],
                "blogsID": [],
                "location": "99 Park Ave, New York, NY 10016, EE. UU."
              },
              "name": "Curso Yoga 1",
              "description": "Este es un curo de yoga que va a volarte la cabeza",
              "weeksDuration": 15,
              "minutesPerSection": 25,
              "level": 1,
              "sections": [],
              "categoryId": "f8caeedb-6bb8-44bf-bdde-04a532bbf261",
              "image": {
                "url": "96954cbd-c90d-4458-b354-b3c26957e69d",
                "id": "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/yoga-en-casa-principiantes_471fbed4_231129144856_1280x800.jpg"
              },
              "tags": [
                "yoga",
                "men"
              ]
            }
          ]
    })
    courses: Course[]

    @ApiProperty({
        example: [
            {
              "progress": {
                "sections": {},
                "userId": "e0f943f5-1327-45e1-a4f9-100c925486f0",
                "courseId": "c380d1b4-edb3-4fd9-9304-5c0c39452464",
                "isCompleted": false
              },
              "completionPercent": 0
            }
          ]
    })
    coursesProgress: ProgressCourse[]

}