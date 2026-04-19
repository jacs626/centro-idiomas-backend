import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }

  @Get('groups')
  getGroupsSummary() {
    return this.service.getGroupsSummary();
  }

  @Get('group/:id')
  getGroupReport(@Param('id', ParseIntPipe) id: number) {
    return this.service.getGroupReports(id);
  }

  @Get('course/:id')
  getCourseReport(@Param('id', ParseIntPipe) id: number) {
    return this.service.getGroupsSummaryByCourse(id);
  }

  @Get('retention/global')
  getGlobalRetention() {
    return this.service.getGlobalRetention();
  }

  @Get('retention/course/:id')
  getCourseRetention(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRetentionByCourse(id);
  }
}
