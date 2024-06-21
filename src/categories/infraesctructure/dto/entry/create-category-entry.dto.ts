import { IsString, MinLength } from "class-validator"



export class CreateCategoryEntryDto {

    @IsString()
    id: string;

    @IsString()
    @MinLength(3)
    categoryName: string;

    @IsString()
    icon: string;
}