import { Role } from '@prisma/client';
import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
};