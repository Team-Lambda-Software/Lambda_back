import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsPositive, IsString, MinLength } from "class-validator"



export class SearchCourseByTagsEntryDto{
    
    @ApiProperty({ type: String, example: ["yoga", "men"], description: "niveles de los cursos"})
    @IsArray()
    @IsString({each: true})
    @MinLength( 1, {each: true} )
    @ArrayMinSize(1)
    tags: string[]
    
}