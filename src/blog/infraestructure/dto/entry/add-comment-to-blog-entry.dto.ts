import { IsString, MinLength } from "class-validator"



export class AddCommentToBlogEntryDto {
    
    @IsString()
    @MinLength(1)
    comment: string
    
}