import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private jwtSecret: string;

  constructor(private readonly configService: ConfigService,
    private readonly jwtService: JwtService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async validatePassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  async createJwt(user: User): Promise<{ token: string }> {
    const payload = { sub: user.id, username: user.username };
    return { token: this.jwtService.sign(payload) };
  }
}
