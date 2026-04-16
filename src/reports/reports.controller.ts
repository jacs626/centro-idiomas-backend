import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('retention/group/:id')
  getRetention(@Param('id', ParseIntPipe) id: number) {
    return this.service.getGroupRetention(id);
  }

  @Get('retention/global')
  getGlobal() {
    return this.service.getGlobalRetention();
  }

  @Get('retention/course/:id')
  getCourseRetention(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRetentionByCourse(id);
  }
}
