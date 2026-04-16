import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('by-enrollment')
  findByEnrollment(@Query('enrollmentId') enrollmentId: string) {
    return this.attendanceService.findByEnrollment(Number(enrollmentId));
  }

  @Get('by-date')
  findByDate(@Query('date') date: string) {
    return this.attendanceService.findByDate(date);
  }

  @Post()
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.attendanceService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(Number(id));
  }
}
