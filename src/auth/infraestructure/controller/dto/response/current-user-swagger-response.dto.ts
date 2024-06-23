import { ApiProperty } from "@nestjs/swagger"

export class CurrentUserSwaggerResponseDto {
    @ApiProperty({ example: '124124-1241241-12412412' })
    id: string
    @ApiProperty({ example: 'carlonzo@gmail.com' })
    email: string
    @ApiProperty({ example: 'Carlos Alonzo' })
    name: string
    @ApiProperty({ example: '04121231231' })
    phone: string
    @ApiProperty({ example: 'fb.com/none.jpg/' })
    image: string
    
}