import { IsString } from "class-validator";

export class GetNotificationsUserDto {
    @IsString()
    email: string
}