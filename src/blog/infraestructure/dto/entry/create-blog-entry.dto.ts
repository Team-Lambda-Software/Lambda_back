import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { ArrayMinSize, IsArray, IsString, IsUUID, MinLength } from "class-validator"




export class CreateBlogEntryDto {

    @IsUUID()
    trainerId: string

    @IsString()
    @MinLength( 3 )
    title: string

    
    @IsString()
    @MinLength( 3 )
    body: string


    @IsUUID()
    categoryId: string

    @IsArray()
    @ArrayMinSize( 1 )
    @IsString( { each: true } )
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    tags: string[]
}