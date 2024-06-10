import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator"


export class AddSectionToCourseEntryDto {

    @IsString()
    @MinLength( 3 )
    name: string

    
    @IsString()
    @MinLength( 3 )
    description: string

    
    @IsInt()
    @Min( 1 )
    duration: number
    
}