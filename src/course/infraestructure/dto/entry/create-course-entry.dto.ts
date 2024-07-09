import { Transform } from "class-transformer"
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, IsUUID, Min, MinLength } from "class-validator"




export class CreateCourseEntryDto {

    
    @IsUUID()
    trainerId: string

    
    @IsString()
    @MinLength( 3 )
    name: string

    
    @IsString()
    @MinLength( 3 )
    description: string

    
    @IsInt()
    @Min( 1 )
    weeksDuration: number

    
    @IsInt()
    @Min( 1 )
    level: number

    
    @IsUUID()
    categoryId: string

    
    @IsArray()
    @ArrayMinSize( 1 )
    @IsString( { each: true } )
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    tags: string[]

}