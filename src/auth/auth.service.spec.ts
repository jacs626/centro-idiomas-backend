import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
(bcrypt.compare as jest.Mock).mockImplementation((pwd: string, hash: string) =>
  Promise.resolve(pwd === 'password123'),
);

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  const mockUsersService = {
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: 'alumno',
    }),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        role: 'alumno',
      };
      const result = await service.register(dto);
      expect(result).toEqual({ message: 'User created' });
      expect(mockUsersService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'alumno',
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const loginDto = { email: 'john@example.com', password: 'password123' };
      const result = await service.login(loginDto);
      expect(result).toHaveProperty('access_token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
      });
    });

    it('should throw UnauthorizedException with invalid email', async () => {
      mockUsersService.findByEmail.mockReturnValue(null);
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const mockUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'alumno',
      };
      mockUsersService.findByEmail.mockReturnValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const loginDto = { email: 'john@example.com', password: 'wrongpassword' };
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('integration: create user via UsersService, authenticate via AuthService', () => {
    it('should authenticate a user created through UsersService', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);

      const newUser = {
        id: 2,
        name: 'Maria Garcia',
        email: 'maria@test.com',
        password: 'hashedpassword123',
        role: 'alumno',
      };
      mockUsersService.create.mockResolvedValue(newUser);
      mockUsersService.findByEmail.mockResolvedValueOnce(newUser);

      await service.register({
        name: 'Maria Garcia',
        email: 'maria@test.com',
        password: 'password123',
        role: 'alumno',
      });

      expect(mockUsersService.create).toHaveBeenCalled();

      const loginResult = await service.login({
        email: 'maria@test.com',
        password: 'password123',
      });

      expect(loginResult).toHaveProperty('access_token');
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'maria@test.com',
      );
    });
  });
});
