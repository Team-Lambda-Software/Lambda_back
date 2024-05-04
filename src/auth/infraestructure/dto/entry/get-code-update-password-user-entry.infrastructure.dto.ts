import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class GetCodeForUpdatePasswordUserInfrastructureDto {
  @ApiProperty({ example: 'carlonsozoa@gmail.com' })
  @IsString()
  @MinLength(8)
  email: string
}
