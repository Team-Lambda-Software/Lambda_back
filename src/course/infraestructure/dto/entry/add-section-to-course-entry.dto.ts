import { IsInt, IsString, Min, MinLength } from "class-validator"


export class AddSectionToCourseEntryDto {

    @IsString()
    @MinLength( 3 )
    name: string

    
    @IsString()
    @MinLength( 3 )
    description: string
    
}