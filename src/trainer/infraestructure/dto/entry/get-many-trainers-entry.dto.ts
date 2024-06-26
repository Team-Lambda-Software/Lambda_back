import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator"

export class GetManyTrainersSwaggerEntryDto {
    @ApiProperty( { required:true, default: 1 } )
    @IsNumber()
    page: number;
    @ApiProperty( { required:true, default: 5 } )
    @IsNumber()
    perPage: number;
    @ApiProperty( {required: false, default: false} )
    @IsOptional()
    @IsBoolean()
    @Transform(( {obj, key} ) => {console.log("recieved value",obj[key]); console.log("parsed value",obj[key]==='true'); return obj[key] === 'true';}) //TEST value read
    userFollow?:boolean;
}