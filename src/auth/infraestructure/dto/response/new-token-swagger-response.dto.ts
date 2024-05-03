import { ApiProperty } from "@nestjs/swagger"

export class NewTokenSwaggerResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiJ9.aHVhbG9uZy5jaGlhbmdAZ21bacwuY29t.PhujWyxfi7WRJyPPryrf2IlPtkpEyQ6BXnFgXXWw0N8' })
    newToken: string
}