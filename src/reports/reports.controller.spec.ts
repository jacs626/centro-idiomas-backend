import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getGroupRetention: jest.fn(),
    getGlobalRetention: jest.fn(),
    getRetentionByCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: mockReportsService }],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRetention', () => {
    it('should return group retention data', async () => {
      const mockRetention = {
        groupId: 1,
        total: 10,
        active: 7,
        completed: 2,
        dropped: 1,
        retention: 90,
      };
      mockReportsService.getGroupRetention.mockResolvedValue(mockRetention);

      const result = await controller.getRetention(1);

      expect(result).toEqual(mockRetention);
      expect(mockReportsService.getGroupRetention).toHaveBeenCalledWith(1);
    });
  });

  describe('getGlobal', () => {
    it('should return global retention data', async () => {
      const mockRetention = {
        total: 100,
        active: 70,
        completed: 20,
        dropped: 10,
        retention: 90,
      };
      mockReportsService.getGlobalRetention.mockResolvedValue(mockRetention);

      const result = await controller.getGlobal();

      expect(result).toEqual(mockRetention);
      expect(mockReportsService.getGlobalRetention).toHaveBeenCalled();
    });
  });

  describe('getCourseRetention', () => {
    it('should return course retention data', async () => {
      const mockRetention = {
        courseId: 1,
        total: 50,
        retention: 80,
      };
      mockReportsService.getRetentionByCourse.mockResolvedValue(mockRetention);

      const result = await controller.getCourseRetention(1);

      expect(result).toEqual(mockRetention);
      expect(mockReportsService.getRetentionByCourse).toHaveBeenCalledWith(1);
    });
  });
});
