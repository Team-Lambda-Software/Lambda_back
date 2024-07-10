import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, IsUUID, Min, MinLength } from "class-validator"




export class CreateCourseEntryDto {

    @ApiProperty({
        example: 'd1f7c8a8-8b2a-4d3f-9b0c-2b0e6e4f5a1b'
    })
    @IsUUID()
    trainerId: string

    @ApiProperty({
        example: 'Nombre del curso'
    })
    @IsString()
    @MinLength( 3 )
    name: string

    
    @ApiProperty({
        example: 'Descripcion del curso'
    })
    @IsString()
    @MinLength( 3 )
    description: string

    @ApiProperty({
        example: 1
    })
    @IsInt()
    @Min( 1 )
    weeksDuration: number

    @ApiProperty({
        example: 1
    })
    @IsInt()
    @Min( 1 )
    level: number

    @ApiProperty({
        example: 'd1f7c8a8-8b2a-4d3f-9b0c-2b0e6e4f5a1b'
    })
    @IsUUID()
    categoryId: string

    @ApiProperty({
        example: 'image'
    })
    @IsString()
    @IsNotEmpty()
    image: string


    @ApiProperty({
        example: ['tag1', 'tag2', 'tag3']
    })
    @IsArray()
    @ArrayMinSize( 1 )
    @IsString( { each: true } )
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    tags: string[]

}