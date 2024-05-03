import { IsString, MinLength } from "class-validator";

export class GetCodeForUpdatePasswordUserInfrastructureDto {
  
  @IsString()
  @MinLength(8)
  email: string
}
