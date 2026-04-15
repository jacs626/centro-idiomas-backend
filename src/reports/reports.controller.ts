import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetReportDto } from './dto/get-report.dto.ts/get-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get()
  getReport(@Query() dto: GetReportDto) {
    return this.service.getReport(dto);
  }
}
