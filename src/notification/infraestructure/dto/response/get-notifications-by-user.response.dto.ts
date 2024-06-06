import { ApiProperty } from "@nestjs/swagger"

export class GetNotificationsUserSwaggerResponse {
    
    @ApiProperty({
        example: "e4b3b3b3-4b3b-4b3b-4b3b-4b3b3b3b3b3b",
    })
    id: string
    
    @ApiProperty({
        example: "Buenos dias",
    })
    title: string
    
    @ApiProperty({
        example: "Buenos dias Carlos Alonzo, recuerda no dejar tus cursos",
    })
    body: string
    
    @ApiProperty({
        example: new Date()
    })
    date: Date
    
    @ApiProperty({
        example: "true",
    })
    userReaded: boolean
}