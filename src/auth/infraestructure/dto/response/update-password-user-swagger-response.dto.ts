import { ApiProperty } from "@nestjs/swagger"

export class UpdatePasswordUserSwaggerResponseDto {
    @ApiProperty({ example: 'carlosolonzo@gmail.com' })
    email: string 
    @ApiProperty({ example: 'nuevappasswor222' })
    newPassword: string
}