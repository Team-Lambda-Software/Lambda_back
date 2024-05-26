import { IsNumber, IsString } from "class-validator"

export class GetNotificationByIdDto {
    @IsString()
    notificationId: string
}