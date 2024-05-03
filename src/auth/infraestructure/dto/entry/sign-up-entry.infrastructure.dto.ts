import { IsString, MinLength } from "class-validator"

export class SignUpEntryInfrastructureDto {
  
  @IsString()
  @MinLength(8)
  email: string
  
  @IsString()
  @MinLength(4)
  password: string
  
  @IsString()
  @MinLength(2)  
  firstName: string
  
  @IsString()
  @MinLength(2)
  firstLastName: string
  
  @IsString()
  @MinLength(2)
  secondLastName: string
}
