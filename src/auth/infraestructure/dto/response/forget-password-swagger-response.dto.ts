import { ApiProperty } from "@nestjs/swagger"

export class ForgetPasswordSwaggerResponseDto {
    @ApiProperty({ example: '1714762430162' })
    date: number
}