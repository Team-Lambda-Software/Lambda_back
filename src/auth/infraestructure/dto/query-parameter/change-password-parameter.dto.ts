import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class ChangePasswordQueryParameterDto {
    
    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'arrozconcanela22' })
    @IsString()
    password: string
  
    @ApiProperty({ example: '9421' })
    @IsString()
    code: string

}