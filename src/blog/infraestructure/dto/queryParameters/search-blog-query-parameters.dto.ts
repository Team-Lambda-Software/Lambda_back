import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/Infraestructure/dto/entry/pagination.dto'


export class SearchBlogQueryParametersDto extends PaginationDto {

    @ApiProperty( { required: false, default: 'RECENT' })
    @IsString()
    @IsIn(['POPULAR', 'RECENT'])
    @IsOptional()
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