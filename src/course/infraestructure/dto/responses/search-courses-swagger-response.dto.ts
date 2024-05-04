import { ApiProperty } from "@nestjs/swagger"
import { SectionImage } from "src/course/domain/entities/compose-fields/section-image"
import { Section } from "src/course/domain/entities/section"




export class SearchCoursesSwaggerResponseDto
{

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
    } )
    id: string

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-52ee-7ba4c709e8a2',
    } )
    trainerId: string

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
                videos: [],
                images: [],
                paragraph: null,
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

}