import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users excluding passwords', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          role: 'alumno',
          password: 'hash',
          createdAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Jane',
          email: 'jane@example.com',
          role: 'profesor',
          password: 'hash',
          createdAt: new Date(),
          deletedAt: null,
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const users = await service.findAll();

      expect(users).toHaveLength(2);
      expect(users[0]).not.toHaveProperty('password');
      expect(users[1]).not.toHaveProperty('password');
    });

    it('should filter by role', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          role: 'alumno',
          password: 'hash',
          createdAt: new Date(),
          deletedAt: null,
        },
      ]);

      await service.findAll('alumno');

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: null,
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const user = await service.findById(1);

      expect(user.name).toBe('John');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for soft deleted user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        deletedAt: new Date(),
      });

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        name: 'John',
        role: 'alumno',
        password: 'hash',
      };
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const user = await service.findByEmail('john@example.com');

      expect(user?.email).toBe('john@example.com');
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'john@example.com', deletedAt: null },
        select: expect.any(Object),
      });
    });

    it('should return null for non-existent email', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const user = await service.findByEmail('nonexistent@example.com');

      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        role: 'alumno' as const,
      };
      const createdUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        password: 'hashed',
        createdAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(result).toEqual(
        expect.objectContaining({ name: 'John', email: 'john@example.com' }),
      );
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        role: 'alumno',
        createdAt: new Date(),
        deletedAt: null,
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
      });

      const result = await service.update(1, { name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
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
      const mockUser = { id: 1, name: 'John', deletedAt: null };
      const deletedUser = { id: 1, name: 'John', deletedAt: new Date() };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(deletedUser);

      const result = await service.remove(1);

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
});
