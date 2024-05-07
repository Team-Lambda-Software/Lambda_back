import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"



export class SearchCategorieEntryDto{
    
    @ApiProperty({ type: String, example: 'Programación', description: "Nombre de la categoria"})
    @IsString()
    @MinLength( 1 )
    name: string
    
}