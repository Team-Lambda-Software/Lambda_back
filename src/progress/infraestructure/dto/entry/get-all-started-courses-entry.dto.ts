import { IsNumber } from "class-validator"

export class GetAllStartedCoursesSwaggerEntryDto {
    @IsNumber()
    page: number
    @IsNumber()
    perPage: number
}