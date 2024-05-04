import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"



export class AddCommentToBlogEntryDto {
    
    @ApiProperty({ type: String, example: 'Este es un comentario', description: "Comentario a agregar al blog"})
    @IsString()
    @MinLength(1)
    comment: string
    
}