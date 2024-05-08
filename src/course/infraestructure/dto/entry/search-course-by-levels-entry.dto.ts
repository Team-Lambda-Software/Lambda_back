import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsPositive } from "class-validator"



export class SearchCourseByLevelsEntryDto{
    
    @ApiProperty({ type: Number, example: '[1,2,3]', description: "niveles de los cursos"})
    @IsArray()
    @IsPositive({each:true})
    @ArrayMinSize(1)
    levels: number[]
    
}