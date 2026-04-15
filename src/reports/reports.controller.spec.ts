import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportType } from './dto/get-report.dto.ts/get-report.dto';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReportsService = {
    getReport: jest.fn(),
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

  describe('getReport', () => {
    it('should call service.getReport with dto', () => {
      const dto = { type: ReportType.RETENTION, groupId: 1 };
      mockReportsService.getReport.mockReturnValue({ type: 'retention', groupId: 1, retentionRate: 85 });
      expect(controller.getReport(dto)).toEqual({ type: 'retention', groupId: 1, retentionRate: 85 });
      expect(mockReportsService.getReport).toHaveBeenCalledWith(dto);
    });

    it('should return progress report', () => {
      const dto = { type: ReportType.PROGRESS, courseId: 1 };
      mockReportsService.getReport.mockReturnValue({ type: 'progress', courseId: 1, averageProgress: 72 });
      expect(controller.getReport(dto)).toEqual({ type: 'progress', courseId: 1, averageProgress: 72 });
    });

    it('should return payments report', () => {
      const dto = { type: ReportType.PAYMENTS };
      mockReportsService.getReport.mockReturnValue({ type: 'payments', status: 'summary', total: 1200 });
      expect(controller.getReport(dto)).toEqual({ type: 'payments', status: 'summary', total: 1200 });
    });

    it('should return attendance report', () => {
      const dto = { type: ReportType.ATTENDANCE };
      mockReportsService.getReport.mockReturnValue({ type: 'attendance', attendanceRate: 90 });
      expect(controller.getReport(dto)).toEqual({ type: 'attendance', attendanceRate: 90 });
    });
  });
});