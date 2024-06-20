import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {

    @ApiProperty( { required: false, default: 10, minimum: 1 })
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // enableImplicitConversions: true
    perPage?: number = 10;
    
    @ApiProperty( { required: false, default: 1, minimum: 1 })
    @IsOptional()
    @Min(1)
    @Type( () => Number ) // enableImplicitConversions: true
    page?: number = 1;

}