import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsString, Min, MinLength } from "class-validator"


export class AddSectionToCourseEntryDto {

    @ApiProperty({
        example: 'Nombre de la seccion'
    })
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty({
        example: 'Descripcion de la seccion'
    })
    @IsString()
    @MinLength( 3 )
    description: string

    
    @ApiProperty({
        example: 1
    })
    @IsInt()
    @Min( 1 )
    duration: number

    @ApiProperty({
        example: 'video'
    })
    @IsString()
    @MinLength( 3 )
    video: string
    
}