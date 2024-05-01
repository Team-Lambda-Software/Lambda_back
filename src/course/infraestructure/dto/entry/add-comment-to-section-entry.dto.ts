import { IsString, MinLength } from "class-validator"



export class AddCommentToSectionEntryDto {
    
    @IsString()
    @MinLength(1)
    comment: string
    
}