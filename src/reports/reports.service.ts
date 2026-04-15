import { Injectable } from '@nestjs/common';
import { GetReportDto } from './dto/get-report.dto.ts/get-report.dto';

@Injectable()
export class ReportsService {
  getReport(dto: GetReportDto) {
    switch (dto.type) {
      case 'retention':
        return this.getRetention(dto);

      case 'progress':
        return this.getProgress(dto);

      case 'payments':
        return this.getPayments(dto);

      case 'attendance':
        return this.getAttendance(dto);

      default:
        return { message: 'Invalid report type' };
    }
  }

  private getRetention(dto: GetReportDto) {
    return {
      type: 'retention',
      groupId: dto.groupId,
      retentionRate: 85, // mock ahora
    };
  }

  private getProgress(dto: GetReportDto) {
    return {
      type: 'progress',
      courseId: dto.courseId,
      averageProgress: 72,
    };
  }

  private getPayments(dto: GetReportDto) {
    return {
      type: 'payments',
      status: 'summary',
      total: 1200,
    };
  }

  private getAttendance(dto: GetReportDto) {
    return {
      type: 'attendance',
      attendanceRate: 90,
    };
  }
}
