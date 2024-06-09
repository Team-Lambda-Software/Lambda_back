/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Trainer } from "src/trainer/domain/trainer";

export class FolloUnfollowSwaggerResponseDto {

    @ApiProperty({example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'})
    id: string

    @ApiProperty({example: 'Arturo'})
    firstName: string

    @ApiProperty({example: 'Perez'})
    firstLastName: string

    @ApiProperty({example: 'Blanco'})
    secondLastName: string

    @ApiProperty({example: 'arturoperez@gmail.com'})
    email: string

    @ApiProperty({example: '0412125150'})
    phone: string
    
    @ApiProperty({
        example: [
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        ]
    })
    followersID: string[]

    @ApiProperty({
        example: [
            
        ]
    })
    coursesID: string[]

    @ApiProperty({
        example: [
            
        ]
    })
    blogsID: string[]


    @ApiProperty({example: 'park avenue'})
    location: string


}