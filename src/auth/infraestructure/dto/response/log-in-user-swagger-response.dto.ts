import { ApiProperty } from "@nestjs/swagger"

export class LogInUserSwaggerResponseDto {
    @ApiProperty({ example: 'carlosolonzo@gmail.com' })
    email: string 
    @ApiProperty({ example: 'Alonzo' })
    firstLastName: string
    @ApiProperty({ example: 'Martinez' })
    secondLastName: string
    @ApiProperty({ example: 'Carlos' })
    firstName: string
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiJ9.aHVhbG9uZy5jaGlhbmdAZ21bacwuY29t.PhujWyxfi7WRJyPPryrf2IlPtkpEyQ6BXnFgXXWw0N8' })
    token: string
    @ApiProperty({ example: '04129812234' })
    phone: string

}