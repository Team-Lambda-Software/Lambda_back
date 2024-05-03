import { ApiProperty } from "@nestjs/swagger"
import { Section } from "src/course/domain/entities/section"
import { SectionComment } from "src/course/domain/entities/section-comment"



export class GetSectionSwaggerResponseDto
{

    @ApiProperty( {
        example: {
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
        },
    } )
    section: Section

    @ApiProperty( {
        example: [
            {
                id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                userId: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                text: 'Muy buena seccion',
                date: new Date(),
                sectionId: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
            }
        ]
    } )
    comments: SectionComment[]

}