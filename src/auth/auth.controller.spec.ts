import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user', () => {
      const dto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        role: 'student',
      };
      mockAuthService.register.mockResolvedValue({ message: 'User created' });
      expect(controller.register(dto)).resolves.toEqual({
        message: 'User created',
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user', () => {
      const dto = { email: 'john@example.com', password: 'password123' };
      mockAuthService.login.mockResolvedValue({ access_token: 'token123' });
      expect(controller.login(dto)).resolves.toEqual({
        access_token: 'token123',
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const dto = { email: 'john@example.com', password: 'wrongpassword' };
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );
      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
