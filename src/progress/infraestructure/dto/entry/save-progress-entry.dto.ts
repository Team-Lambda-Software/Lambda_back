import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsUUID } from "class-validator";

export class SaveProgressEntryDto
{
    @ApiProperty({ type: String, example:'a94d9eb1-efab-43a3-97d6-31f1236b198b', description: "Id del curso a actualizar"})
    @IsUUID() 
    courseId: string;

    @ApiProperty( {
        example: false, type:Boolean,
        description: "Se desea marcar la leccion como completada?"
    } )
    @IsBoolean()
    markAsCompleted: boolean;

    @ApiProperty({ type: String, example:'a94d9eb1-efab-43a3-97d6-31f1236b198b', description: "Id de la leccion a actualizar"})
    @IsUUID() 
    lessonId: string;

    @ApiProperty( {
        example: 21, type:Number,
        description: "Tiempo reproducido del video que pertenece a la leccion, en segundos, si hay algun video asociado"
    } )
    @IsOptional()
    @IsNumber()
    time?: number;
}