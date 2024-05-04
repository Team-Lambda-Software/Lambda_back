import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"



export class SearchBlogEntryDto{
    
    @ApiProperty({ type: String, example: 'Blog de yoga', description: "Nombre del blog"})
    @IsString()
    @MinLength( 1 )
    title: string
    
}