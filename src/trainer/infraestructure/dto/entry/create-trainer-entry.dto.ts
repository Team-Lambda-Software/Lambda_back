import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTrainerEntryDto {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  firstLastName: string;

  @ApiProperty({
    example: 'Smith',
  })
  @IsString()
  @MinLength(2)
  secondLastName: string;

  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  phone: string;
}
