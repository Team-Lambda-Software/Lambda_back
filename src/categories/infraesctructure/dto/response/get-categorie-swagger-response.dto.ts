import { ApiProperty } from "@nestjs/swagger"
import { Category } from "src/categories/domain/categories"
import { CategoryIcon } from "src/categories/domain/entities/category-icon"

export class GetCategorieSwaggerResponseDto
{

    @ApiProperty({
        example: '24117a35-07b0-4890-a70f-a082c948b3d4',
    })
    id: string

    @ApiProperty({
        example: 'Yoga',
    })
    name: string

    @ApiProperty({
        example: 'Aprende yoga',
    })
    description: string

    @ApiProperty({
        example: {
            url: 'https://www.google.com', 
            id: '24117a35-07b0-4890-a70f-a082c948b3d4'},
    })
    icon: CategoryIcon

}