import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';
import { User } from '@prisma/client';
import { ApiResponse } from '../common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req.user as User;
    const profile = await this.authService.getProfile(user);
    return new ApiResponse(200, 'Profile fetched successfully', profile);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto) {
    const user = req.user as User;
    return this.authService.updateProfile(user, body);
  }
}
