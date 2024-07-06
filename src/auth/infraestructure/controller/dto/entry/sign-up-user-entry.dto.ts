import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SignUpUserEntryInfraDto {
    
    @ApiProperty( { required: true, default: 'CLIENT' })
    @IsString()
    @IsIn(['CLIENT', 'ADMIN'])
    @IsOptional()
    type: string;

    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'arrozconcanela22' })
    @IsString()
    password: string
  
    @ApiProperty({ example: 'Carlos' })
    @IsString()
    name: string
  
    @ApiProperty({ example: '04131234123' })
    @IsString()
    phone: string

}