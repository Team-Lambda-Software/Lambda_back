import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class LogInUserQueryParameterDto {
    
    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'arrozconcanela22' })
    @IsString()
    password: string
  
}