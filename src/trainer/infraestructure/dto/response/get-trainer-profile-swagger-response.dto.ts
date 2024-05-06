import { ApiProperty } from "@nestjs/swagger";
import { Course } from "src/course/domain/course";
import { Blog } from "src/blog/domain/blog";
import { Trainer } from "src/trainer/domain/trainer";

export class GetTrainerProfileSwaggerResponseDto
{
    @ApiProperty( {
        example: {
            firstName: 'Pedro',
            firstLastName: 'Perez',
            secondLastName: 'Peraza',
            email: 'elcorreodepedro@gmail.com',
            phone: '584242305590',
            followersID: '[7bcbfd8a-e775-4149-83ee-9ba4c709e8a2, 14357495-695e-4e74-9f4e-3472574be36e, 7bcbfd8a-e775-4149-9f4e-3472574be36e]',
            location: 'Montalban'
        }
    } )
    trainer: Trainer;

    @ApiProperty( {
        example: 21,
    } )
    followerCount:number;

    @ApiProperty( {
        example: [
            {
                id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                trainerId: '14357495-695e-4e74-9f4e-3472574be36e',
                name: 'Saludo al Sol para principiantes',
                description: 'Domina el Saludo al Sol en tres dias',
                weeks_duration: 1,
                minutes_per_section: 45,
                level: 1,
                sections: [
                    {
                        id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                        name: 'Introduccion a yoga',
                        description: 'En esta seccion aprenderas lo basico de yoga',
                        videos: [ {
                            id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                            url: 'https://www.google.com'
                        } ],
                        images: [ {
                            id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                            url: 'https://www.google.com'
                        } ],
                        paragraph: 'En la postura del sol naciente vas a poder alcanzar',
                    }
                ],
                categoryId: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                image: {
                    id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                    url: 'https://www.google.com'
                }
            }
        ]
    } )
    courses:Course[];

    @ApiProperty( {
        example: [
            {
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
            }
        ],
    } )
    blogs:Blog[];
}