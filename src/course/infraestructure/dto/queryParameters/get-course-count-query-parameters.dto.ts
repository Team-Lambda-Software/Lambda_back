import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsUUID } from "class-validator"



export class GetCourseCountQueryParametersDto {
    
    @ApiProperty( { required: false })
    @IsUUID()
    @IsOptional()
    trainer?: string

    @ApiProperty( { required: false })
    @IsUUID()
    @IsOptional()
    category?: string
}