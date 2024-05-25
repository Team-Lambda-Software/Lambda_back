import { IsNumber, IsString } from "class-validator"

export class GetNotificationUserDto {
    @IsString()
    notificationId: string
}