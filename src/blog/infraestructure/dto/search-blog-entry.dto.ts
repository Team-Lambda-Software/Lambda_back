import { IsString, MinLength } from "class-validator"



export class SearchBlogEntryDto{
    
    @IsString()
    @MinLength( 1 )
    title: string
    
}