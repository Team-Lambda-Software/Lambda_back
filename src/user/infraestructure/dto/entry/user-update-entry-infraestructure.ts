/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class userUpdateEntryInfraestructureDto{
    
    @ApiProperty({
        required: false,
        example: "bastidas@gmail.com"
    })
    @IsString()
    @IsOptional()
    @MinLength(8)
    email? :string;

    @ApiProperty({
        required: false,
        example: "Luigi Alessandro Bastidas Di Ruscio"
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        required: false,
        example: "password"
    })
    @IsString()
    @IsOptional()
    @MinLength(7)
    password?: string;

    @ApiProperty({
        required: false,
        example: "04120145758"
    })
    @IsString()
    @IsOptional()
    @MinLength(11)
    @MaxLength(11)
    phone?: string;

    @ApiProperty({
        required: false,
        example: "base64 string"
    })
    @IsOptional()
    @IsString()
    @MinLength(5)
    image?: string

}