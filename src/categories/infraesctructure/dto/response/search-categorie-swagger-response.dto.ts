import { ApiProperty } from "@nestjs/swagger"
//import { Categorie } from "src/categories/domain/categories"

export class SearchCategorieSwaggerResponseDto
{

    @ApiProperty({
        example: "ft76498s-3487-4sf8-d8r9-9f717694b3e9"
    })
    id: string

    @ApiProperty({
        example: "Manualidad"
    })
    nameCategorie: string

    @ApiProperty({
        example: "Categoria Delta"
    })
    description: string
   
}