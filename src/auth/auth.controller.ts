import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  async register(@Body() user: User) {
    try {
      user.password = await this.authService.hashPassword(user.password);

      // persist the user to the database
      const newUser = await this.userRepository.save(user);
      return newUser;
    } catch (err) {
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    }
  }
}
