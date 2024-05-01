import { IsString, MinLength } from "class-validator"



export class SearchCourseEntryDto{
    
    @IsString()
    @MinLength( 1 )
    name: string
    
}