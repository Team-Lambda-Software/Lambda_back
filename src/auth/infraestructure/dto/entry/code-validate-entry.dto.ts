import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class CodeValidateEntryInfraDto {
    
    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: '9421' })
    @IsString()
    code: string
  
}