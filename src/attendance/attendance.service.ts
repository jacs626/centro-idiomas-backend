import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto/update-attendance.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAttendanceDto) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: dto.enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment no existe');
    }

    const existing = await this.prisma.attendance.findFirst({
      where: {
        enrollmentId: dto.enrollmentId,
        date: new Date(dto.date),
      },
    });

    if (existing) {
      throw new BadRequestException('Asistencia ya registrada para este día');
    }

    return this.prisma.attendance.create({
      data: {
        enrollmentId: dto.enrollmentId,
        date: new Date(dto.date),
        status: dto.status,
      },
    });
  }

  async findByEnrollment(enrollmentId: number) {
    return this.prisma.attendance.findMany({
      where: { enrollmentId },
      orderBy: { date: 'asc' },
    });
  }

  async findByGroup(groupId: number) {
    return this.prisma.attendance.findMany({
      where: {
        enrollment: {
          groupId,
        },
      },
      include: {
        enrollment: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance no encontrada');
    }

    return this.prisma.attendance.update({
      where: { id },
      data: {
        status: dto.status,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });
  }
}
