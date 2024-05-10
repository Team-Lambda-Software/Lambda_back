import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsUUID} from "class-validator";

export class SaveVideoProgressEntryDto
{
    @ApiProperty({ type: String, example:'96c87e47-6e42-4a32-9788-1c4f7342f4fc', description: "Id del video"})
    @IsUUID() //to-do check that it is UUIDv4
    videoId:string;

    @ApiProperty({ type: Boolean, example:true, description:"Indica si el video se completo"})
    @IsOptional()
    @IsBoolean()
    isCompleted?:boolean;

    @ApiProperty({ type: Number, example: 2111, description:"Punto actual en la reproduccion del video, en milisegundos"})
    @IsOptional()
    @IsPositive()
    @IsNumber()
    playbackMilisec?:number;
}