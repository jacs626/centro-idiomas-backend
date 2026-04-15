import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = { name: 'John', email: 'john@example.com', password: 'password123', role: 'student' };
      const result = await service.register(dto);
      expect(result).toEqual({ message: 'User created' });
    });

    it('should hash the password', async () => {
      const dto = { name: 'Jane', email: 'jane@example.com', password: 'mypassword', role: 'student' };
      await service.register(dto);
      const users = (service as any).users;
      const user = users.find((u: any) => u.email === dto.email);
      const isValid = await bcrypt.compare(dto.password, user.password);
      expect(isValid).toBe(true);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const dto = { name: 'John', email: 'john@example.com', password: 'password123', role: 'student' };
      await service.register(dto);
      const loginDto = { email: 'john@example.com', password: 'password123' };
      const result = await service.login(loginDto);
      expect(result).toHaveProperty('access_token');
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with invalid email', async () => {
      const loginDto = { email: 'nonexistent@example.com', password: 'password123' };
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const dto = { name: 'John', email: 'john@example.com', password: 'password123', role: 'student' };
      await service.register(dto);
      const loginDto = { email: 'john@example.com', password: 'wrongpassword' };
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});