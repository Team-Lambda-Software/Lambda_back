import { ApiProperty } from "@nestjs/swagger"
import { Section } from "src/course/domain/entities/section"
import { SectionComment } from "src/course/domain/entities/section-comment"
import { ProgressVideo } from "src/progress/domain/entities/progress-video"



export class GetSectionSwaggerResponseDto
{

    @ApiProperty( {
        example: {
            id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
            name: 'Introduccion a yoga',
            description: 'En esta seccion aprenderas lo basico de yoga',
            video: {
                id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                url: 'https://www.google.com'
            },
            image:  {
                id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
                url: 'https://www.google.com'
            } ,
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
    
    @ApiProperty( {
        example: [
            {
              "userId": "e0f943f5-1327-45e1-a4f9-100c925486f0",
              "videoId": "96c87e47-6e42-4a32-9788-1c4f7342f4fc",
              "playbackMilisec": "200",
              "isCompleted": false
            }
          ]
    } )
    videoProgress: ProgressVideo[]
}