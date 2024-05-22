import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator"


export class AddSectionToCourseEntryDto {

    @ApiProperty(
        {
            example: 'seccion 1',
        }
    )
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty(
        {
            example: 'descripcion de la seccion 1',
        }
    )
    @IsString()
    @MinLength( 3 )
    description: string

    @ApiProperty(
        {
            example: 10,
        }
    )
    @IsInt()
    @Min( 1 )
    duration: number

    @ApiProperty(
        {
            example: 'https://www.youtube.com/watch?v=video1',
        }
    )
    @IsString()
    @IsOptional()
    video?: string

    @ApiProperty(
        {
            example: 'https://www.image.com/image1',
        }
    )
    @IsString()
    @IsOptional()
    image?: string

    @ApiProperty(
        {
            example: 'parrafo de la seccion 1',
        }
    )
    @IsString()
    @IsOptional()
    paragraph?: string

    @ApiProperty(
        {
            example: 'f7b3b3b3-4b7b-4b3b-8b3b-3b3b3b3b3b3b',
        }
    )
    @IsUUID()
    courseId: string
}