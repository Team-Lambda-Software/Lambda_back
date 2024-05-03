import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsString, MinLength } from "class-validator"

export class UpdatePasswordUserInfrastructureDto {
  
  @ApiProperty({ example: 'carlonsozoa@gmail.com' })
  @IsString()
  @MinLength(8)
  email: string
  
  @ApiProperty({ example: 'nuevappasswor222' })
  @IsString()
  @MinLength(4)
  password: string

  @ApiProperty({ example: '4242' })
  @IsString()
  @MinLength(4)
  code: string
}
