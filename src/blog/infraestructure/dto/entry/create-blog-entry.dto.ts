import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsInt, IsString, IsUUID, Min, MinLength } from "class-validator"




export class CreateBlogEntryDto {

    @ApiProperty(
        {
            example: 'f7b3b3b3-4b7b-4b3b-8b3b-3b3b3b3b3b3b',
        }
    )
    @IsUUID()
    trainerId: string

    @ApiProperty(
        {
            example: 'Titulo de la entrada',
        }
    )
    @IsString()
    @MinLength( 3 )
    title: string

    @ApiProperty(
        {
            example: 'Cuerpo de la entrada',
        }
    )
    @IsString()
    @MinLength( 3 )
    body: string

    @ApiProperty(
        {
            example: ['https://www.image.com/image1', 'https://www.image.com/image2'],
        }
    )
    @IsArray()
    @IsString( { each: true } )
    images: string[]

    @ApiProperty(
        {
            example: 'f7b3b3b3-4b7b-4b3b-8b3b-3b3b3b3b3b3b',
        }
    )
    @IsUUID()
    categoryId: string

    @ApiProperty(
        {
            example: ['tag1', 'tag2'],
        }
    )
    @IsArray()
    @IsString( { each: true } )
    tags: string[]
}