import { ApiProperty } from "@nestjs/swagger"

export class CheckTokenSwaggerResponseDto {
    @ApiProperty({ example: true })
    tokenIsValid: boolean
}