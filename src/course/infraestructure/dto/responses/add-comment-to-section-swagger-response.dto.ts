import { ApiProperty } from "@nestjs/swagger"
import { SectionComment } from "src/course/domain/entities/section-comment"



export class AddCommentToSectionSwaggerResponseDto
{

    @ApiProperty( {
        example:
        {
            id: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
            userId: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
            text: 'Muy buena seccion',
            date: new Date(),
            sectionId: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
        }

    } )
    comments: SectionComment

}