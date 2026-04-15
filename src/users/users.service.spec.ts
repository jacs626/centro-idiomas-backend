import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('CRUD Operations', () => {
    const dto = { name: 'John', email: 'john@example.com', password: 'password123', role: 'alumno' };

    describe('create', () => {
      it('should create a user with hashed password', async () => {
        const result = await service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.name).toBe(dto.name);
        expect(result.email).toBe(dto.email);
        expect(result).not.toHaveProperty('password');
      });
    });

    describe('findAll', () => {
      it('should return all users without passwords', async () => {
        await service.create(dto);
        const users = service.findAll();
        expect(users).toHaveLength(1);
        expect(users[0]).not.toHaveProperty('password');
      });
    });

    describe('findById', () => {
      it('should return a user by id', async () => {
        const created = await service.create(dto);
        const user = service.findById(created.id);
        expect(user.name).toBe(dto.name);
      });

      it('should throw NotFoundException for non-existent user', () => {
        expect(() => service.findById(999)).toThrow(NotFoundException);
      });
    });

    describe('update', () => {
      it('should update a user', async () => {
        const created = await service.create(dto);
        const updated = service.update(created.id, { name: 'Updated Name' });
        expect(updated.name).toBe('Updated Name');
      });

      it('should throw NotFoundException for non-existent user', () => {
        expect(() => service.update(999, { name: 'Test' })).toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove a user', async () => {
        const created = await service.create(dto);
        const removed = service.remove(created.id);
        expect(removed.id).toBe(created.id);
        expect(service.findAll()).toHaveLength(0);
      });

      it('should throw NotFoundException for non-existent user', () => {
        expect(() => service.remove(999)).toThrow(NotFoundException);
      });
    });

    describe('findByEmail', () => {
      it('should return user by email', async () => {
        await service.create(dto);
        const user = service.findByEmail(dto.email);
        expect(user?.email).toBe(dto.email);
      });

      it('should return undefined for non-existent email', () => {
        const user = service.findByEmail('nonexistent@example.com');
        expect(user).toBeUndefined();
      });
    });
  });
});