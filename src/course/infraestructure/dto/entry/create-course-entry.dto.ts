import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsInt, IsString, IsUUID, Min, MinLength } from "class-validator"




export class CreateCourseEntryDto {

    @ApiProperty(
        {
            example: 'f7b3b3b3-4b7b-4b3b-8b3b-3b3b3b3b3b3b',
        }
    )
    @IsUUID()
    trainerId: string

    @ApiProperty(
        {
            example: 'Curso de programación en Python',
        }
    )
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty(
        {
            example: 'Curso de programación en Python con ejemplos prácticos',
        }
    )
    @IsString()
    @MinLength( 3 )
    description: string

    @ApiProperty(
        {
            example: 4,
        }
    )
    @IsInt()
    @Min( 1 )
    weeksDuration: number

    @ApiProperty(
        {
            example: 60,
        }
    )
    @IsInt()
    @Min( 1 )
    minutesDuration: number

    @ApiProperty(
        {
            example: 1,
        }
    )
    @IsInt()
    @Min( 1 )
    level: number

    @ApiProperty(
        {
            example: 'f7b3b3b3-4b7b-4b3b-8b3b-3b3b3b3b3b3b',
        }
    )
    @IsUUID()
    categoryId: string

    @ApiProperty(
        {
            example: ['Python', 'Programación'],
        }
    )
    @IsArray()
    @ArrayMinSize( 1 )
    @IsString( { each: true } )
    tags: string[]

    @ApiProperty(
        {
            example: 'https://www.google.com',
        }
    )
    @IsString()
    imageUrl: string
}