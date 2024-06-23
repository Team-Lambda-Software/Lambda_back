import { ApiProperty } from "@nestjs/swagger"

export class SaveTokenSwaggerResponseDto {
    @ApiProperty({ example: 'user-id-12312321' })
    userId: string
    @ApiProperty({ example: 'token-tokwnq-12312321' })
    address: string
    
}