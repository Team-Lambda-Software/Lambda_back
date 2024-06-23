import { ApiProperty } from "@nestjs/swagger"

export class LogInUserSwaggerResponseDto {
    @ApiProperty({ example: { id: '123242-123123-123123-12312312', email: 'calonzo@gmail.com', name: 'Carlos Alonzo', phone: '04121231231'  } })
    user: {
        id: string,
        email: string,
        name: string,
        phone: string
    }
    @ApiProperty({ example: 'CLIENT' })
    type: string
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiJ9.aHVhbG9uZy5jaGlhbmdAZ21bacwuY29t.PhujWyxfi7WRJyPPryrf2IlPtkpEyQ6BXnFgXXWw0N8' })
    token: string
}