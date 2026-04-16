import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let prisma: PrismaService;

  const mockPrisma = {
    attendance: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an attendance', async () => {
      const dto = {
        enrollmentId: 1,
        date: '2024-01-01',
        status: 'present' as const,
      };
      const mockAttendance = {
        id: 1,
        ...dto,
        date: new Date('2024-01-01'),
      };

      mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.attendance.findFirst.mockResolvedValue(null);
      mockPrisma.attendance.create.mockResolvedValue(mockAttendance);

      const result = await service.create(dto);

      expect(result).toEqual(mockAttendance);
    });

    it('should throw NotFoundException when enrollment not found', async () => {
      const dto = {
        enrollmentId: 999,
        date: '2024-01-01',
        status: 'present' as const,
      };

      mockPrisma.enrollment.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when attendance already exists', async () => {
      const dto = {
        enrollmentId: 1,
        date: '2024-01-01',
        status: 'present' as const,
      };

      mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.attendance.findFirst.mockResolvedValue({ id: 1 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an attendance', async () => {
      const mockAttendance = {
        id: 1,
        enrollmentId: 1,
        date: new Date('2024-01-01'),
        status: 'present',
      };
      const dto = { status: 'absent' as const };

      mockPrisma.attendance.findUnique.mockResolvedValue(mockAttendance);
      mockPrisma.attendance.update.mockResolvedValue({
        ...mockAttendance,
        ...dto,
      });

      const result = await service.update(1, dto);

      expect(result.status).toBe('absent');
    });

    it('should throw NotFoundException when attendance not found', async () => {
      mockPrisma.attendance.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { status: 'absent' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEnrollment', () => {
    it('should return attendances by enrollment', async () => {
      const mockAttendances = [
        { id: 1, enrollmentId: 1, date: new Date(), status: 'present' },
      ];
      mockPrisma.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findByEnrollment(1);

      expect(result).toEqual(mockAttendances);
    });
  });

  describe('findByGroup', () => {
    it('should return attendances by group', async () => {
      const mockAttendances = [
        {
          id: 1,
          enrollmentId: 1,
          date: new Date(),
          status: 'present',
          enrollment: { user: { id: 1, name: 'John' } },
        },
      ];
      mockPrisma.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findByGroup(1);

      expect(result).toEqual(mockAttendances);
    });
  });
});
