import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  userId: string;
  role?: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET') || 'defaultsecret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findUser({
      id: payload.userId,
      isDeleted: false,
    });
    if (!user) {
      throw new UnauthorizedException('Account not found');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked');
    }
    return { userId: payload.userId, ...user };
  }
}
