import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/common/hash.service';
import { RegisterDto } from './dto/register.dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await this.hashService.hash(dto.password);
    return this.userService.createUser({ ...dto, password: hashedPassword });
  }

//   async login(dto: LoginDto) {
//     const user = await this.userService.findByEmail(dto.email);
//     if (!user) throw new UnauthorizedException('Invalid credentials');

//     const isPasswordValid = await this.hashService.comparePassword(
//       dto.password,
//       user.password,
//     );

//     if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

//     const payload = { sub: user.id, email: user.email };
//     return { access_token: this.jwtService.sign(payload) };
//   }

//   async getProfile(user: any) {
//     return this.userService.findById(user.userId);
//   }
}
