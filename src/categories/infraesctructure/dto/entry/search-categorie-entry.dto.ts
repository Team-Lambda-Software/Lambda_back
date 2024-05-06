import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"



export class SearchCategorieEntryDto{
    
    @ApiProperty({ type: String, example: 'Programación', description: "Nombre del blog"})
    @IsString()
    @MinLength( 1 )
    title: string
    
}