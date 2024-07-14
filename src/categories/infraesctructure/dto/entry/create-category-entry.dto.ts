import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryEntryDto {
  @ApiProperty({
    example: 'Category name',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'base64image',
  })
  @IsString()
  icon: string;
}
