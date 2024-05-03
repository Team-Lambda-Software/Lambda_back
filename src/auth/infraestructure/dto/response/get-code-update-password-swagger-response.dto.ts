import { ApiProperty } from "@nestjs/swagger"

export class GetCodeUpdatePasswordSwaggerResponseDto {
    @ApiProperty({ example: 'carlosolonzo@gmail.com' })
    email: string 
    @ApiProperty({ example: '4989' })
    code: string
    @ApiProperty({ example: '1714762430162' })
    date: number
}