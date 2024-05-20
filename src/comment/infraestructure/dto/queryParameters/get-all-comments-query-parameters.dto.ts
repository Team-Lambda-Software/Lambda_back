import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/Infraestructure/dto/entry/pagination.dto'


export class GetAllCommentsQueryParametersDto extends PaginationDto {
    
    @ApiProperty( { required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    @Type( () => String ) // enableImplicitConversions: true
    blog?: string

    @ApiProperty( { required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    @Type( () => String ) // enableImplicitConversions: true
    lesson?: string
}