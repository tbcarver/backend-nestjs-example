import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../../src/user/user.entity';
import { HttpStatus, HttpException } from '@nestjs/common';
import { RegisterUserDto } from '../../src/auth/dto/register-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

const registerUserDto: RegisterUserDto = {
  username: 'testuser',
  email: 'test@test.com',
  password: 'password',
};

const newUser = new User();
const existingUser = new User();

const mockAuthService: AuthService = {
  hashPassword: jest.fn(),
} as any;

const mockUserRepository: Repository<User> = {
  findOneBy: jest.fn((options) => {
    if (options['username'] === 'testuser') {
      return existingUser;
    }
    if (options['email'] === 'test@test.com') {
      return existingUser;
    }
    return null;
  }),
  save: jest.fn(() => newUser),
} as any;

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should throw a conflict error when the username is already in use', async () => {
      try {
        await authController.register({ ...registerUserDto, email: 'newemail@test.com' });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.getResponse()).toBe('Username already in use.');
      }
    });

    it('should throw a conflict error when the email is already in use', async () => {
      try {
        await authController.register({ ...registerUserDto, username: 'newuser' });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.getResponse()).toBe('Email already in use.');
      }
    });

    it('should return a user when the registration is successful', async () => {
      const result = await authController.register({ ...registerUserDto, username: 'newuser', email: 'new@email.com' });
      expect(result).toBe(newUser);
    });
  });
});

