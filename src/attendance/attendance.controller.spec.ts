import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  const mockAttendance: CreateAttendanceDto & { id: number } = {
    id: 1,
    enrollmentId: 1,
    date: '2024-01-01',
    status: 'present',
  };

  const mockAttendanceService = {
    findAll: jest.fn(),
    findByEnrollment: jest.fn(),
    findByDate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  describe('findAll', () => {
    it('should return all attendances', () => {
      mockAttendanceService.findAll.mockReturnValue([mockAttendance]);
      expect(controller.findAll()).toEqual([mockAttendance]);
    });
  });

  describe('findByEnrollment', () => {
    it('should return attendances by enrollment', () => {
      mockAttendanceService.findByEnrollment.mockReturnValue([mockAttendance]);
      expect(controller.findByEnrollment('1')).toEqual([mockAttendance]);
      expect(mockAttendanceService.findByEnrollment).toHaveBeenCalledWith(1);
    });
  });

  describe('findByDate', () => {
    it('should return attendances by date', () => {
      mockAttendanceService.findByDate.mockReturnValue([mockAttendance]);
      expect(controller.findByDate('2024-01-01')).toEqual([mockAttendance]);
    });
  });

  describe('create', () => {
    it('should create an attendance', () => {
      const dto: CreateAttendanceDto = {
        enrollmentId: 1,
        date: '2024-01-01',
        status: 'present',
      };
      mockAttendanceService.create.mockReturnValue(mockAttendance);
      expect(controller.create(dto)).toEqual(mockAttendance);
    });
  });

  describe('update', () => {
    it('should update an attendance', () => {
      const dto = { status: 'absent' as const };
      mockAttendanceService.update.mockReturnValue({
        ...mockAttendance,
        ...dto,
      });
      expect(controller.update('1', dto)).toEqual({
        ...mockAttendance,
        ...dto,
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockAttendanceService.update = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.update('999', { status: 'absent' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an attendance', () => {
      mockAttendanceService.remove.mockReturnValue(mockAttendance);
      expect(controller.remove('1')).toEqual(mockAttendance);
    });

    it('should throw NotFoundException when not found', async () => {
      mockAttendanceService.remove = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
