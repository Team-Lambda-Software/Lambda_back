import { ApiProperty } from "@nestjs/swagger"

export class GetNotReadedNotificationSwaggerResponse {
    
    @ApiProperty({
        example: "12",
    })
    count: number
}