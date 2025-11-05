import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { HashService } from 'src/common/hash.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await this.hashService.hash(dto.password);
    return this.userService.register({ ...dto, password: hashedPassword });
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findUser({
      email: dto.email,
      isDeleted: false,
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.hashService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id };
    return { ...user, access_token: this.jwtService.sign(payload) };
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
