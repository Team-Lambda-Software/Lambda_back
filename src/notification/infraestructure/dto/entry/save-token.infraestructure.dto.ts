import { IsString } from "class-validator";

export class SaveTokenDto {
    @IsString()    
    token: string
    @IsString()
    email: string
}