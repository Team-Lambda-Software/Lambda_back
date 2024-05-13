/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserProfileSwaggerResponseDto {

    @ApiProperty({example: 'Arturo'})
    firstName: string

    @ApiProperty({example: 'Perez'})
    firstLastName: string

    @ApiProperty({example: 'Blanco'})
    secondLastName: string

    @ApiProperty({example: 'arturoperez@gmail.com'})
    email: string

    @ApiProperty({example: ''})
    password: string
    
    @ApiProperty({example: '0412125150'})
    phone: string

}