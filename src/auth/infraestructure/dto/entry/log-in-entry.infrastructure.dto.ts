import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class LogInEntryInfrastructureDto {
  @ApiProperty({ example: 'carlonsozoa@gmail.com' })
  @IsString()
  @MinLength(8)
  email: string
  
  @ApiProperty({ example: 'tupassfav23232' })
  @IsString()
  @MinLength(4)
  password: string
}
