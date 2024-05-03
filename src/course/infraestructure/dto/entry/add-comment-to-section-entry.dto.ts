import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"



export class AddCommentToSectionEntryDto {
    
    @ApiProperty({ type: String, example: 'este es un comentario', description: "Comentario a agregar a la seccion"})
    @IsString()
    @MinLength(1)
    comment: string
    
}