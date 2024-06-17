import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class GetAllStartedCoursesSwaggerEntryDto {
    @ApiProperty( { required:true, default: 0 } )
    @IsNumber()
    page: number
    @ApiProperty( { required:true, default: 5 } )
    @IsNumber()
    perPage: number
}