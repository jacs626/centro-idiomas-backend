import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const dto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        role: 'alumno' as const,
      };

      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        ...dto,
        password: 'hashed',
        createdAt: new Date(),
        deletedAt: null,
      });

      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(dto.name);
      expect(result.email).toBe(dto.email);
      expect(result).not.toHaveProperty('password');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          role: 'alumno',
          createdAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Jane',
          email: 'jane@example.com',
          role: 'profesor',
          createdAt: new Date(),
          deletedAt: null,
        },
      ]);

      const users = await service.findAll();
      expect(users).toHaveLength(2);
      expect(users[0]).not.toHaveProperty('password');
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: null,
      });

      const user = await service.findById(1);
      expect(user.name).toBe('John');
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: null,
      });
      mockPrisma.user.update.mockResolvedValue({
        id: 1,
        name: 'Updated Name',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: null,
      });

      const updated = await service.update(1, { name: 'Updated Name' });
      expect(updated.name).toBe('Updated Name');
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: null,
      });
      mockPrisma.user.update.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: new Date(),
      });

      const removed = await service.remove(1);
      expect(removed.id).toBe(1);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: null,
      });

      const user = await service.findByEmail('john@example.com');
      expect(user?.email).toBe('john@example.com');
    });

    it('should return null for non-existent email', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      const user = await service.findByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });
});
