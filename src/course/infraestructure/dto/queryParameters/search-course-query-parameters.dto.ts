import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/Infraestructure/dto/entry/pagination.dto'


export class SearchCourseQueryParametersDto extends PaginationDto {

    @ApiProperty( { required: true, default: 'RECENT' })
    @IsString()
    @IsIn(['POPULAR', 'RECENT'])
    @Type( () => String ) // enableImplicitConversions: true
    filter: string;
    
    @ApiProperty( { required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    @Type( () => String ) // enableImplicitConversions: true
    category?: string

    @ApiProperty( { required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    @Type( () => String ) // enableImplicitConversions: true
    trainer?: string
}