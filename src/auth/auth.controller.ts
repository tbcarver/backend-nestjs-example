import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const password = await this.authService.hashPassword(registerUserDto.password);
    const user = new User({ ...registerUserDto, password });

    let existingUser = await this.userRepository.findOneBy(
      { username: registerUserDto.username },
    );

    if (existingUser) {
      throw new HttpException('Username already in use.', HttpStatus.CONFLICT);
    }

    existingUser = await this.userRepository.findOneBy(
      { email: registerUserDto.email },
    );

    if (existingUser) {
      throw new HttpException('Email already in use.', HttpStatus.CONFLICT);
    }

    return await this.userRepository.save(user);
  }
}
