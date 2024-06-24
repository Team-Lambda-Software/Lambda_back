import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsUUID } from "class-validator"



export class GetBlogCountQueryParametersDto {
    
    @ApiProperty( { required: false })
    @IsUUID()
    @IsOptional()
    trainer?: string

    @ApiProperty( { required: false })
    @IsUUID()
    @IsOptional()
    category?: string
}