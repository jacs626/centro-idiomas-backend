import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  const mockAttendance = {
    id: 1,
    enrollmentId: 1,
    date: new Date('2024-01-01'),
    status: 'present',
  };

  const mockAttendanceService = {
    create: jest.fn(),
    update: jest.fn(),
    findByEnrollment: jest.fn(),
    findByGroup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        { provide: AttendanceService, useValue: mockAttendanceService },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceService>(AttendanceService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an attendance', async () => {
      const dto: CreateAttendanceDto = {
        enrollmentId: 1,
        date: '2024-01-01',
        status: 'present',
      };
      mockAttendanceService.create.mockResolvedValue(mockAttendance);

      const result = await controller.create(dto);

      expect(result).toEqual(mockAttendance);
      expect(mockAttendanceService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an attendance', async () => {
      const dto: { status: 'present' | 'absent' | 'late' } = {
        status: 'absent',
      };
      const updated = { ...mockAttendance, ...dto };
      mockAttendanceService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto);

      expect(result).toEqual(updated);
      expect(mockAttendanceService.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when not found', async () => {
      mockAttendanceService.update.mockRejectedValue(
        new NotFoundException('Attendance no encontrada'),
      );

      await expect(
        controller.update(999, { status: 'absent' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEnrollment', () => {
    it('should return attendances by enrollment', async () => {
      mockAttendanceService.findByEnrollment.mockResolvedValue([
        mockAttendance,
      ]);

      const result = await controller.findByEnrollment(1);

      expect(result).toEqual([mockAttendance]);
      expect(mockAttendanceService.findByEnrollment).toHaveBeenCalledWith(1);
    });
  });

  describe('findByGroup', () => {
    it('should return attendances by group', async () => {
      mockAttendanceService.findByGroup.mockResolvedValue([mockAttendance]);
      const req = { user: { sub: 1, role: 'admin' } } as any;

      const result = await controller.findByGroup(1, req);

      expect(result).toEqual([mockAttendance]);
      expect(mockAttendanceService.findByGroup).toHaveBeenCalledWith(1, req.user);
    });
  });
});
