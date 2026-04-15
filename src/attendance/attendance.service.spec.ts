import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { NotFoundException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  describe('CRUD Operations', () => {
    const dto = { userId: 1, groupId: 1, date: '2024-01-01', status: 'present' as const };

    describe('create', () => {
      it('should create an attendance', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.userId).toBe(dto.userId);
        expect(result.status).toBe(dto.status);
      });
    });

    describe('findAll', () => {
      it('should return all attendances', () => {
        service.create(dto);
        const attendances = service.findAll();
        expect(attendances).toHaveLength(1);
      });
    });

    describe('findByUser', () => {
      it('should return attendances by user', () => {
        service.create(dto);
        service.create({ userId: 1, groupId: 2, date: '2024-01-02', status: 'absent' as const });
        const attendances = service.findByUser(1);
        expect(attendances).toHaveLength(2);
      });
    });

    describe('findByGroup', () => {
      it('should return attendances by group', () => {
        service.create(dto);
        const attendances = service.findByGroup(1);
        expect(attendances).toHaveLength(1);
      });
    });

    describe('findByDate', () => {
      it('should return attendances by date', () => {
        service.create(dto);
        const attendances = service.findByDate('2024-01-01');
        expect(attendances).toHaveLength(1);
      });
    });

    describe('update', () => {
      it('should update an attendance', () => {
        const created = service.create(dto);
        const updated = service.update(created.id, { status: 'absent' });
        expect(updated.status).toBe('absent');
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.update(999, { status: 'absent' })).toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove an attendance', () => {
        const created = service.create(dto);
        const removed = service.remove(created.id);
        expect(removed.id).toBe(created.id);
        expect(service.findAll()).toHaveLength(0);
      });

      it('should throw NotFoundException for non-existent', () => {
        expect(() => service.remove(999)).toThrow(NotFoundException);
      });
    });
  });
});