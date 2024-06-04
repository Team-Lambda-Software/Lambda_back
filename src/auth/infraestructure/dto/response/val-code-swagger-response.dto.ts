import { ApiProperty } from "@nestjs/swagger"

export class ValidateCodeForgetPasswordSwaggerResponseDto {
    @ApiProperty({ example: '1714' })
    code: string
    @ApiProperty({ example: true })
    validate: boolean
}