import { ApiProperty } from "@nestjs/swagger"



export class GetUserSwaggerResponseDto {

    @ApiProperty({
        example: 'e0f943f5-1327-45e1-a4f9-100c925486f0'
    })
    id: string

    @ApiProperty({
        example: 'John'
    })
    firstName: string

    @ApiProperty({
        example: 'Doe'
    })
    firstLastName: string

    @ApiProperty({
        example: 'Doe'
    })
    secondLastName: string

    @ApiProperty({
        example: 'john@gmail.com'
    })
    email: string

    @ApiProperty({
        example: '12345678'
    })
    phone: string
}