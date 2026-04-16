import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  const mockPrisma = {
    enrollment: {
      count: jest.fn(),
    },
    group: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGroupRetention', () => {
    it('should calculate retention rate for a group', async () => {
      mockPrisma.enrollment.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(7) // active
        .mockResolvedValueOnce(2) // completed
        .mockResolvedValueOnce(1); // dropped

      const result = await service.getGroupRetention(1);

      expect(result).toEqual({
        groupId: 1,
        total: 10,
        active: 7,
        completed: 2,
        dropped: 1,
        retention: 90,
      });
    });

    it('should return 0 retention when no enrollments', async () => {
      mockPrisma.enrollment.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await service.getGroupRetention(1);

      expect(result.retention).toBe(0);
    });
  });

  describe('getGlobalRetention', () => {
    it('should calculate global retention rate', async () => {
      mockPrisma.enrollment.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(70) // active
        .mockResolvedValueOnce(20) // completed
        .mockResolvedValueOnce(10); // dropped

      const result = await service.getGlobalRetention();

      expect(result).toEqual({
        total: 100,
        active: 70,
        completed: 20,
        dropped: 10,
        retention: 90,
      });
    });
  });

  describe('getRetentionByCourse', () => {
    it('should calculate retention rate for a course', async () => {
      mockPrisma.group.findMany.mockResolvedValue([
        {
          enrollments: [
            { status: 'active' },
            { status: 'completed' },
            { status: 'dropped' },
          ],
        },
        { enrollments: [{ status: 'active' }, { status: 'active' }] },
      ]);

      const result = await service.getRetentionByCourse(1);

      expect(result).toEqual({
        courseId: 1,
        total: 5,
        retention: 80,
      });
    });

    it('should return 0 retention when no enrollments', async () => {
      mockPrisma.group.findMany.mockResolvedValue([]);

      const result = await service.getRetentionByCourse(1);

      expect(result.retention).toBe(0);
    });
  });
});
