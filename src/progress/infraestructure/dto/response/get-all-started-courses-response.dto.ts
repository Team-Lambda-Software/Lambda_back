import { ApiProperty } from "@nestjs/swagger";

export class GetAllStartedCoursesSwaggerResponseDto
{
    @ApiProperty( {
        example: "8fe7e9dc-c594-4d27-8502-b7bd18d5a72f"
    } )
    id: string;

    @ApiProperty( {
        example: "Yoga para Principiantes II"
    } )
    title: string;

    @ApiProperty( {
        example: "https://cs210032000ecc9b343.blob.core.windows.net/lambda-media-container/170246-843069659_small.mp4"
    } )
    image: string;

    @ApiProperty( {
        example: new Date()
    } )
    date: Date;

    @ApiProperty( {
        example: "fisico"
    } )
    category: string;

    @ApiProperty( {
        example: "Pedro Perez Lopez"
    } )
    trainer: string;

    @ApiProperty( {
        example: 21.11
    } )
    percent: number;
}