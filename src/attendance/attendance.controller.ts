import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto/update-attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: number; role: string; email: string };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles('admin', 'profesor')
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Patch(':id')
  @Roles('admin', 'profesor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, dto);
  }

  @Get('my-attendance')
  @Roles('alumno')
  getMyAttendance(@Req() req: RequestWithUser) {
    return this.attendanceService.getAttendanceByUser(req.user.sub);
  }

  @Get('enrollment/:id')
  findByEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findByEnrollment(id);
  }

  @Get('by-enrollment/:enrollmentId')
  findByEnrollmentAlt(@Param('enrollmentId', ParseIntPipe) enrollmentId: number) {
    return this.attendanceService.findByEnrollment(enrollmentId);
  }

  @Get('group/:id')
  @Roles('admin', 'profesor')
  findByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findByGroup(id);
  }
}
