/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserProfileSwaggerResponseDto {

    @ApiProperty({
        required: true,
        example:"425169e1-e2ce-43f0-ab60-864500b32da9"
    })
    @IsString()
    @IsOptional()
    Id: string;

}