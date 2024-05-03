import { IsString, MinLength } from "class-validator"

export class LogInEntryInfrastructureDto {
  
  @IsString()
  @MinLength(8)
  email: string
  
  @IsString()
  @MinLength(4)
  password: string
}
