import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

interface CreateSessionData {
  userId: string;
  role?: string; // Assuming you pass role directly in the data
  deviceType?: string; // Optional, if you track device
  deviceToken?: string; // Optional, if you track device token
}

interface SessionWithToken {
  userId: string;
  sessionId: string; // Returning the entire session object from Prisma
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
    private readonly prisma: PrismaService,
  ) {}

  // Create a session with JWT token and store it in the database (Prisma)
  async createSessionAndToken(data: CreateSessionData): Promise<string> {
    // Optionally, store the session in Prisma (if needed)
    const session = await this.prisma.session.create({
      data: {
        userId: data.userId,
        deviceType: data.deviceType,
        deviceToken: data.deviceToken,
      }
    });

    // Generate JWT token
    const tokenPayload: SessionWithToken = {
      sessionId: session.id,
      userId: data.userId,
      role: data.role,
    }
    const accessToken = await this.jwtService.sign(tokenPayload);

    // Return the JWT token and session details
    return accessToken;
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await this.commonService.hash(dto.password);
    return this.userService.register({ ...dto, password: hashedPassword });
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findUser({
      email: dto.email,
      isDeleted: false,
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.commonService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id, role: user.role };
    return { ...user, access_token: await this.createSessionAndToken(payload) };
  }

  async getProfile(user: User) {
    return this.userService.findUser({
      id: user.id,
      isDeleted: false,
    });
  }

  async updateProfile(user: User, body: UpdateProfileDto) {
    return this.userService.updateUser(user.id, body);
  }
}
