import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  sessionId: string;
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
    const session = await this.userService.getSessionById(payload.sessionId);
    console.log('session: ', session);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }
    const user = await this.userService.findUser({
      id: session?.userId,
      isDeleted: false,
    });
    if (!user) {
      throw new UnauthorizedException('Account not found');
    }
    console.log('user: ', user);

    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked');
    }
    return { userId: payload.userId, ...user };
  }
}
