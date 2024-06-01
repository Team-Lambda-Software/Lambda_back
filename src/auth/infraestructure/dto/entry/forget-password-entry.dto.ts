import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class ForgetPasswordEntryInfraDto {
    
    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string

}