import { ApiProperty } from "@nestjs/swagger"

export class SaveTokenSwaggerResponseDto {
    @ApiProperty({ example: 'carlosolonzo@gmail.com' })
    email: string
    @ApiProperty({ example: 'asdkaslkdjas-asdlkjansdkasld-asdasdlkasd' })
    address: string
    @ApiProperty({ example: 'Save token successfull' })
    message: string
}