import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  describe('CRUD Operations', () => {
    const dto: CreateAttendanceDto = {
      enrollmentId: 1,
      date: '2024-01-01',
      status: 'present',
    };

    describe('create', () => {
      it('should create an attendance', () => {
        const result = service.create(dto);
        expect(result).toHaveProperty('id');
        expect(result.enrollmentId).toBe(dto.enrollmentId);
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

    describe('findByEnrollment', () => {
      it('should return attendances by enrollment', () => {
        service.create(dto);
        service.create({
          enrollmentId: 1,
          date: '2024-01-02',
          status: 'absent',
        });
        const attendances = service.findByEnrollment(1);
        expect(attendances).toHaveLength(2);
      });

      it('should return empty array when no attendances', () => {
        const attendances = service.findByEnrollment(999);
        expect(attendances).toHaveLength(0);
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
        expect(() => service.update(999, { status: 'absent' })).toThrow(
          NotFoundException,
        );
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
