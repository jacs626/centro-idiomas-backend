import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto/update-attendance.dto';

type Attendance = {
  id: number;
  userId: number;
  groupId: number;
  date: string;
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
      ...dto,
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

  findByUser(userId: number) {
    return this.attendances.filter((a) => a.userId === userId);
  }

  findByGroup(groupId: number) {
    return this.attendances.filter((a) => a.groupId === groupId);
  }

  findByDate(date: string) {
    return this.attendances.filter((a) => a.date === date);
  }
}