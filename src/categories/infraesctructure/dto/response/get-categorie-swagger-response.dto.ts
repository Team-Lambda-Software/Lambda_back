import { ApiProperty } from "@nestjs/swagger"
import { Categorie } from "src/categories/domain/categories"

export class GetCategorieSwaggerResponseDto
{

    @ApiProperty( {
        example: {
            "id": "c998936e-2386-4a9d-a3a2-9f717694b3e9",
            "categorieName": "Programacion",
            "description": "Orientada a objetos",
            
        },
    } )
    categorie: Categorie

}