import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"



export class SearchAllEntryDto{
    
    @ApiProperty({ type: String, example: 'Curso de yoga', description: "Nombre del curso"})
    @IsString()
    @MinLength( 1 )
    name: string
    
}