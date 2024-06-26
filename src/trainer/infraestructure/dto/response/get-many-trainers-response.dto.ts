import { ApiProperty } from "@nestjs/swagger";
import { Course } from "src/course/domain/course";
import { Blog } from "src/blog/domain/blog";
import { Trainer } from "src/trainer/domain/trainer";

export class GetManyTrainersSwaggerResponseDto
{
    @ApiProperty( {
        example: 'Pedro Perez Peraza',
    } )
    name: string;

    @ApiProperty( {
        example: '7bcbfd8a-e775-4149-83ee-9ba4c709e8a2',
    } )
    id:string;

    @ApiProperty( {
        example: 21,
    } )
    followers:number;

    @ApiProperty( {
        example: true,
    } )
    userFollow: boolean;

    @ApiProperty( {
        example: '-46.8772, 30.2114',
    } )
    location:string;
}