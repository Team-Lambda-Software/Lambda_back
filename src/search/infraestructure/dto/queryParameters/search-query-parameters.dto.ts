import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/Infraestructure/dto/entry/pagination.dto'


export class SearchQueryParametersDto extends PaginationDto {
    
    @ApiProperty( { required: false})
    @IsOptional()
    @IsString()
    @Type( () => String ) // enableImplicitConversions: true
    term?: string

    @ApiProperty( { required: false,  isArray: true})
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    tag?: string[]
}