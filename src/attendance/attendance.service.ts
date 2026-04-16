import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto/update-attendance.dto';

type Attendance = {
  id: number;
  enrollmentId: number;
  date: Date | string;
  status: 'present' | 'absent' | 'late';
};

@Injectable()
export class AttendanceService {
  private attendances: Attendance[] = [];

  findAll() {
    return this.attendances;
  }

  create(dto: CreateAttendanceDto) {
    const newAttendance: Attendance = {
      id: Date.now(),
      enrollmentId: dto.enrollmentId,
      date: new Date(dto.date),
      status: dto.status,
    };
    this.attendances.push(newAttendance);
    return newAttendance;
  }

  update(id: number, dto: UpdateAttendanceDto) {
    const index = this.attendances.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Attendance with id ${id} not found`);
    }
    this.attendances[index] = { ...this.attendances[index], ...dto };
    return this.attendances[index];
  }

  remove(id: number) {
    const index = this.attendances.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Attendance with id ${id} not found`);
    }
    return this.attendances.splice(index, 1)[0];
  }

  findByEnrollment(enrollmentId: number) {
    return this.attendances.filter((a) => a.enrollmentId === enrollmentId);
  }

  findByDate(date: string) {
    const dateObj = new Date(date);
    return this.attendances.filter((a) => {
      const attendanceDate =
        typeof a.date === 'string' ? new Date(a.date) : a.date;
      return (
        attendanceDate.toISOString().split('T')[0] ===
        dateObj.toISOString().split('T')[0]
      );
    });
  }
}
