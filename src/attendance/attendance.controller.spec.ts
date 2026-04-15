import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { NotFoundException } from '@nestjs/common';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  const mockAttendance = { id: 1, userId: 1, groupId: 1, date: '2024-01-01', status: 'present' as const };

  const mockAttendanceService = {
    findAll: jest.fn(),
    findByUser: jest.fn(),
    findByGroup: jest.fn(),
    findByDate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [{ provide: AttendanceService, useValue: mockAttendanceService }],
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

  describe('findByUser', () => {
    it('should return attendances by user', () => {
      mockAttendanceService.findByUser.mockReturnValue([mockAttendance]);
      expect(controller.findByUser('1')).toEqual([mockAttendance]);
    });
  });

  describe('findByGroup', () => {
    it('should return attendances by group', () => {
      mockAttendanceService.findByGroup.mockReturnValue([mockAttendance]);
      expect(controller.findByGroup('1')).toEqual([mockAttendance]);
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
      const dto = { userId: 1, groupId: 1, date: '2024-01-01', status: 'present' as const };
      mockAttendanceService.create.mockReturnValue(mockAttendance);
      expect(controller.create(dto)).toEqual(mockAttendance);
    });
  });

  describe('update', () => {
    it('should update an attendance', () => {
      const dto = { status: 'absent' as const };
      mockAttendanceService.update.mockReturnValue({ ...mockAttendance, ...dto });
      expect(controller.update('1', dto)).toEqual({ ...mockAttendance, ...dto });
    });

    it('should throw NotFoundException when not found', async () => {
      mockAttendanceService.update = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an attendance', () => {
      mockAttendanceService.remove.mockReturnValue(mockAttendance);
      expect(controller.remove('1')).toEqual(mockAttendance);
    });

    it('should throw NotFoundException when not found', async () => {
      mockAttendanceService.remove = jest.fn().mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});