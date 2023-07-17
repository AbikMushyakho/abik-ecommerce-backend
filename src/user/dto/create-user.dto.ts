import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'john12' })
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'John Kawan' })
  @IsString()
  readonly fullName: string;

  @ApiProperty({ example: 'Los Angle' })
  @IsString()
  readonly address: string;

  @ApiProperty({ minLength: 6, example: 'None@1' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  readonly password: string;

  @ApiProperty({ example: '+977 9011100001' })
  @IsPhoneNumber()
  readonly phone_number: string;
}
