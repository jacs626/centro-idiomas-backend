import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getSummary: jest.fn(),
    getGroupsSummary: jest.fn(),
    getGroupReports: jest.fn(),
    getGroupsSummaryByCourse: jest.fn(),
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

  describe('getSummary', () => {
    it('should return system summary', async () => {
      const mockSummary = {
        enrollments: { total: 100, active: 70, completed: 20, dropped: 10, retention: 90 },
        payments: { total: 100, paid: 70, pending: 20, late: 10, paidPercent: 70, pendingPercent: 20, latePercent: 10, totalIncome: 10000 },
      };
      mockReportsService.getSummary.mockResolvedValue(mockSummary);

      const result = await controller.getSummary();

      expect(result).toEqual(mockSummary);
      expect(mockReportsService.getSummary).toHaveBeenCalled();
    });
  });

  describe('getGroupsSummary', () => {
    it('should return summary for all groups', async () => {
      const mockGroupsSummary = [
        { groupId: 1, groupName: 'Group A', courseName: 'English', total: 10, active: 7, completed: 2, dropped: 1, retention: 90, avgProgress: 75 },
      ];
      mockReportsService.getGroupsSummary.mockResolvedValue(mockGroupsSummary);

      const result = await controller.getGroupsSummary();

      expect(result).toEqual(mockGroupsSummary);
      expect(mockReportsService.getGroupsSummary).toHaveBeenCalled();
    });
  });

  describe('getGroupReport', () => {
    it('should return detailed report for a group', async () => {
      const mockGroupReport = {
        groupId: 1,
        groupName: 'Group A',
        courseName: 'English',
        enrollments: { total: 10, active: 7, completed: 2, dropped: 1, retention: 90 },
        avgProgress: 75,
        attendance: { present: 80, absent: 15, late: 5, presentPercent: 80, absentPercent: 15, latePercent: 5 },
        payments: { total: 1000, paid: 700, pending: 200, late: 100, paidPercent: 70, pendingPercent: 20, latePercent: 10, totalIncome: 1000 },
      };
      mockReportsService.getGroupReports.mockResolvedValue(mockGroupReport);

      const result = await controller.getGroupReport(1);

      expect(result).toEqual(mockGroupReport);
      expect(mockReportsService.getGroupReports).toHaveBeenCalledWith(1);
    });
  });

  describe('getCourseReport', () => {
    it('should return summary for all groups in a course', async () => {
      const mockCourseReport = [
        { groupId: 1, groupName: 'Group A', courseName: 'English', total: 10, active: 7, completed: 2, dropped: 1, retention: 90, avgProgress: 75 },
        { groupId: 2, groupName: 'Group B', courseName: 'English', total: 8, active: 6, completed: 1, dropped: 1, retention: 87.5, avgProgress: 70 },
      ];
      mockReportsService.getGroupsSummaryByCourse.mockResolvedValue(mockCourseReport);

      const result = await controller.getCourseReport(1);

      expect(result).toEqual(mockCourseReport);
      expect(mockReportsService.getGroupsSummaryByCourse).toHaveBeenCalledWith(1);
    });
  });
});