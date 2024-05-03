import { IsString, MinLength } from "class-validator"

export class UpdatePasswordUserInfrastructureDto {
  
  @IsString()
  @MinLength(8)
  email: string
  
  @IsString()
  @MinLength(4)
  password: string
}
