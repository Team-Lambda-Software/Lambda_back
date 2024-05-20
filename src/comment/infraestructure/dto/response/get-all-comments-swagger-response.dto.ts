import { ApiProperty } from "@nestjs/swagger"



export class GetAllCommentsSwaggerResponseDto {
    @ApiProperty(
        {
            example: 'a94d9eb1-efab-43a3-97d6-31f1236b198b',
        }
    )
    id: string

    @ApiProperty(
        {
            example: 'Pedro Perez Ochoa',
        }
    )
    user: string

    @ApiProperty(
        {
            example: 'Este es un comentario',
        }
    )
    body: string

    @ApiProperty(
        {
            example: new Date(),
        }
    )
    date: Date
}