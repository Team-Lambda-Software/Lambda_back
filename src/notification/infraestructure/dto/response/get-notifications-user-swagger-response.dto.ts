import { ApiProperty } from "@nestjs/swagger"

export class GetNotificationsUserSwaggerResponseDto {
    @ApiProperty({ example: 'carlosolonzo@gmail.com' })
    email: string
    @ApiProperty({ example: '[{ id:"", title:"", message:"", user_id:"" }, {...}]' })
    notification: {
        id: string,
        title: string,
        message: string,
        user_id: string
    }[]
}