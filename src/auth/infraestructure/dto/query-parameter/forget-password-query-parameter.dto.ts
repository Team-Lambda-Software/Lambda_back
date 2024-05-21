import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class ForgetPasswordQueryParameterDto {
    
    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string

}