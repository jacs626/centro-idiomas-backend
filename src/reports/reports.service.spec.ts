import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { GetReportDto, ReportType } from './dto/get-report.dto.ts/get-report.dto';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsService],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  describe('getReport', () => {
    it('should return retention report', () => {
      const dto: GetReportDto = { type: ReportType.RETENTION, groupId: 1 };
      const result = service.getReport(dto);
      expect(result).toEqual({ type: 'retention', groupId: 1, retentionRate: 85 });
    });

    it('should return progress report', () => {
      const dto: GetReportDto = { type: ReportType.PROGRESS, courseId: 1 };
      const result = service.getReport(dto);
      expect(result).toEqual({ type: 'progress', courseId: 1, averageProgress: 72 });
    });

    it('should return payments report', () => {
      const dto: GetReportDto = { type: ReportType.PAYMENTS };
      const result = service.getReport(dto);
      expect(result).toEqual({ type: 'payments', status: 'summary', total: 1200 });
    });

    it('should return attendance report', () => {
      const dto: GetReportDto = { type: ReportType.ATTENDANCE };
      const result = service.getReport(dto);
      expect(result).toEqual({ type: 'attendance', attendanceRate: 90 });
    });

    it('should return error message for invalid type', () => {
      const dto: GetReportDto = { type: 'invalid' as any };
      const result = service.getReport(dto);
      expect(result).toEqual({ message: 'Invalid report type' });
    });
  });
});