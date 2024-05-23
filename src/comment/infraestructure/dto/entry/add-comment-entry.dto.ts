import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsString, IsUUID, MinLength } from "class-validator"




export class AddCommentEntryDto {

    @ApiProperty(
        {
            type: String,
            example: 'a94d9eb1-efab-43a3-97d6-31f1236b198b',
            description: "Id del blog o seccion a la que se le quiere agregar el comentario"
        }
    )
    @IsString()
    @IsUUID()
    target: string

    @ApiProperty(
        {
            type: String,
            example: 'LESSON',
            description: "Tipo de target al que se le quiere agregar el comentario"
        }
    )
    @IsString()
    @IsIn( ['LESSON', 'BLOG'] )
    targetType: string

    @ApiProperty(
        {
            type: String,
            example: 'Este es un comentario',
            description: "Contenido del comentario"
        }
    )
    @IsString()
    @MinLength( 1 )
    body: string

}