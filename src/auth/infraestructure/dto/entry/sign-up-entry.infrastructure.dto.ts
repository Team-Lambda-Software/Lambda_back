import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class SignUpEntryInfrastructureDto {
  @ApiProperty({ example: 'carlonsozoa@gmail.com' })
  @IsString()
  @MinLength(8)
  email: string
  
  @ApiProperty({ example: 'arrozconcanela22' })
  @IsString()
  @MinLength(4)
  password: string

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @MinLength(2)  
  firstName: string
  
  @ApiProperty({ example: 'Alonzo' })
  @IsString()
  @MinLength(2)
  firstLastName: string
  
  @ApiProperty({ example: 'Martinez' })
  @IsString()
  secondLastName: string

  @ApiProperty({ example: '04131234123' })
  @IsString()
  @MinLength(4)
  phone: string
}
