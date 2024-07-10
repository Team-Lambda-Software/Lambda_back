import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { ArrayMinSize, IsArray, IsString, IsUUID, MinLength } from "class-validator"




export class CreateBlogEntryDto {

    @ApiProperty({
        example: 'd1f7c8a8-8b2a-4d3f-9b0c-2b0e6e4f5a1b'
    })
    @IsUUID()
    trainerId: string

    @ApiProperty({
        example: 'Titulo de la entrada'
    })
    @IsString()
    @MinLength( 3 )
    title: string

    @ApiProperty({
        example: 'Cuerpo de la entrada'
    })
    @IsString()
    @MinLength( 3 )
    body: string

    @ApiProperty({
        example: 'd1f7c8a8-8b2a-4d3f-9b0c-2b0e6e4f5a1b'
    })
    @IsUUID()
    categoryId: string

    @ApiProperty({
        example: ['tag1', 'tag2', 'tag3']
    })
    @IsArray()
    @ArrayMinSize( 1 )
    @IsString( { each: true } )
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    tags: string[]


    @ApiProperty({
        example: ['image1', 'image2', 'image3']
    })
    @IsArray()
    @ArrayMinSize( 1 )
    @IsString( { each: true } )
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    images: string[]

}