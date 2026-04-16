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
@Roles('admin', 'profesor')
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
