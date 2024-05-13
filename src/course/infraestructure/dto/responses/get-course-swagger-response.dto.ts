import { ApiProperty } from "@nestjs/swagger"
import { SectionImage } from "src/course/domain/entities/compose-fields/section-image"
import { Section } from "src/course/domain/entities/section"
import { Trainer } from "src/trainer/domain/trainer"




export class GetCourseSwaggerResponseDto
{

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
    } )
    id: string

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
        example: 'Curso de programacion en python',
    } )
    name: string

    @ApiProperty( {
        example: 'Curso de programacion en python',
    } )
    description: string

    @ApiProperty( {
        example: 8,
    } )
    weeks_duration: number

    @ApiProperty( {
        example: 30,
    } )
    minutes_per_section: number

    @ApiProperty( {
        example: 1,
    } )
    level: number

    @ApiProperty( {
        example: [
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
        ]
    } )
    sections: Section[]

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
    } )
    categoryId: string

    @ApiProperty( {
        example: {
            id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
            url: 'https://www.google.com'
        },
    } )
    image: SectionImage

    @ApiProperty( {
        example: ['yoga', 'salud'],
    } )
    tags: string[]

}