import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

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

  @Post('login')
  async login(@Body() loginDto: LoginDto) {

    const user = await this.userRepository.findOneBy(
      { username: loginDto.username },
    );

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const isValid = await this.authService.validatePassword(user.password, loginDto.password);

    if (!isValid) {
      throw new HttpException('Invalid login.', HttpStatus.FORBIDDEN);
    }

    return this.authService.createJwt(user);
  }
}
