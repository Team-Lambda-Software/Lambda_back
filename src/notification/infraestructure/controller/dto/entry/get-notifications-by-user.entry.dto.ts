import { IsNumber } from "class-validator"

export class GetNotificationsUserDto {
    @IsNumber()
    page: number
    @IsNumber()
    perPage: number

}