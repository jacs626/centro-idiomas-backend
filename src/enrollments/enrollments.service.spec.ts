import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { NotFoundException } from '@nestjs/common';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentsService],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  describe('CRUD Operations', () => {
    const dto = { userId: 1, groupId: 1, status: 'active' };

    describe('create', () => {
      it('should create an enrollment', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.userId).toBe(dto.userId);
        expect(result.groupId).toBe(dto.groupId);
        expect(result.status).toBe(dto.status);
      });
    });

    describe('findAll', () => {
      it('should return all enrollments', () => {
        service.create(dto);
        const enrollments = service.findAll();
        expect(enrollments).toHaveLength(1);
      });
    });

    describe('findByUser', () => {
      it('should return enrollments by user', () => {
        service.create(dto);
        service.create({ userId: 1, groupId: 2, status: 'active' });
        const enrollments = service.findByUser(1);
        expect(enrollments).toHaveLength(2);
      });

      it('should return empty array when no enrollments', () => {
        const enrollments = service.findByUser(999);
        expect(enrollments).toHaveLength(0);
      });
    });

    describe('findByGroup', () => {
      it('should return enrollments by group', () => {
        service.create(dto);
        const enrollments = service.findByGroup(1);
        expect(enrollments).toHaveLength(1);
      });
    });

    describe('update', () => {
      it('should update an enrollment', () => {
        const created = service.create(dto);
        const updated = service.update(created.id, { status: 'completed' });
        expect(updated.status).toBe('completed');
      });

      it('should throw NotFoundException for non-existent enrollment', () => {
        expect(() => service.update(999, { status: 'test' })).toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove an enrollment', () => {
        const created = service.create(dto);
        const removed = service.remove(created.id);
        expect(removed.id).toBe(created.id);
        expect(service.findAll()).toHaveLength(0);
      });

      it('should throw NotFoundException for non-existent enrollment', () => {
        expect(() => service.remove(999)).toThrow(NotFoundException);
      });
    });
  });
});