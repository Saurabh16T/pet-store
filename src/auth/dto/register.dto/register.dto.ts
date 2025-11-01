import { Role } from '@prisma/client';
import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; // optional, default will be used

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;
}